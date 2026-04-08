import express from "express";
import { z } from "zod";
import { authRequired } from "../middleware/auth.js";
import { Appointment } from "../models/Appointment.js";
import { serializeAppointment } from "../utils/helpers.js";

const router = express.Router();
const sessionStore = new Map();
const sessionTtlMs = 1000 * 60 * 60 * 4;

const signalSchema = z.object({
  type: z.enum(["offer", "answer", "candidate", "call-ended", "participant-ready"]),
  payload: z.any().optional().default({}),
});

function cleanupSessions() {
  const now = Date.now();

  for (const [sessionKey, session] of sessionStore.entries()) {
    if (now - session.updatedAt > sessionTtlMs) {
      sessionStore.delete(sessionKey);
    }
  }
}

function getSession(appointmentId) {
  cleanupSessions();

  if (!sessionStore.has(appointmentId)) {
    sessionStore.set(appointmentId, {
      updatedAt: Date.now(),
      lastEventId: 0,
      events: [],
    });
  }

  const session = sessionStore.get(appointmentId);
  session.updatedAt = Date.now();
  return session;
}

function appendEvent(session, targetRole, type, payload = {}) {
  const event = {
    id: ++session.lastEventId,
    targetRole,
    type,
    payload,
    createdAt: new Date().toISOString(),
  };

  session.updatedAt = Date.now();
  session.events.push(event);

  if (session.events.length > 150) {
    session.events = session.events.slice(-150);
  }

  return event;
}

async function findConsultation(appointmentId, currentUser) {
  const appointment = await Appointment.findById(appointmentId).populate("doctor").populate("patient");

  if (!appointment) {
    return { error: "Appointment not found.", status: 404 };
  }

  if (appointment.type !== "online") {
    return { error: "Video consultation is available for online appointments only.", status: 400 };
  }

  const userId = currentUser._id.toString();
  const isDoctor = appointment.doctor?._id?.toString() === userId;
  const isPatient = appointment.patient?._id?.toString() === userId;

  if (!isDoctor && !isPatient) {
    return { error: "You do not have access to this consultation.", status: 403 };
  }

  return {
    appointment,
    role: isDoctor ? "doctor" : "patient",
  };
}

router.post("/:appointmentId/join", authRequired, async (req, res) => {
  try {
    const consultation = await findConsultation(req.params.appointmentId, req.user);

    if (consultation.error) {
      return res.status(consultation.status).json({ message: consultation.error });
    }

    const { appointment, role } = consultation;
    const oppositeRole = role === "doctor" ? "patient" : "doctor";
    const session = getSession(req.params.appointmentId);

    appendEvent(session, oppositeRole, "participant-ready", {
      role,
      name: req.user.name,
    });

    if (appointment.status === "confirmed") {
      appointment.status = "ongoing";
      await appointment.save();
    }

    return res.json({
      role,
      appointment: serializeAppointment(appointment),
      rtcConfiguration: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });
  } catch (error) {
    console.error("Failed to join consultation.", error);
    return res.status(500).json({ message: "Failed to join the video consultation." });
  }
});

router.get("/:appointmentId/events", authRequired, async (req, res) => {
  try {
    const consultation = await findConsultation(req.params.appointmentId, req.user);

    if (consultation.error) {
      return res.status(consultation.status).json({ message: consultation.error });
    }

    const session = getSession(req.params.appointmentId);
    const after = Number.parseInt(String(req.query.after || "0"), 10) || 0;
    const events = session.events.filter((event) => event.id > after && event.targetRole === consultation.role);

    return res.json({ events });
  } catch (error) {
    console.error("Failed to fetch consultation events.", error);
    return res.status(500).json({ message: "Failed to fetch consultation events." });
  }
});

router.post("/:appointmentId/events", authRequired, async (req, res) => {
  try {
    const consultation = await findConsultation(req.params.appointmentId, req.user);

    if (consultation.error) {
      return res.status(consultation.status).json({ message: consultation.error });
    }

    const parsed = signalSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid consultation event payload." });
    }

    const oppositeRole = consultation.role === "doctor" ? "patient" : "doctor";
    const session = getSession(req.params.appointmentId);
    appendEvent(session, oppositeRole, parsed.data.type, parsed.data.payload);

    return res.json({ success: true });
  } catch (error) {
    console.error("Failed to post consultation event.", error);
    return res.status(500).json({ message: "Failed to post consultation event." });
  }
});

export default router;

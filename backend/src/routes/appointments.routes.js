import express from "express";
import { z } from "zod";
import { authRequired, requireRole } from "../middleware/auth.js";
import { Appointment } from "../models/Appointment.js";
import { Notification } from "../models/Notification.js";
import { QueueEntry } from "../models/QueueEntry.js";
import { User } from "../models/User.js";
import { createAppointmentDateTime, serializeAppointment } from "../utils/helpers.js";

const router = express.Router();

const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1),
  consultationType: z.enum(["online", "offline"]),
  selectedDate: z.string().min(1),
  selectedSlot: z.string().min(1),
  reason: z.string().min(2).default("General consultation"),
  paymentMethod: z.enum(["upi", "card", "wallet", "netbanking"]).default("upi"),
});

async function findAuthorizedAppointment(appointmentId, currentUser) {
  const appointment = await Appointment.findById(appointmentId).populate("patient").populate("doctor");

  if (!appointment) {
    return null;
  }

  if (currentUser.role === "admin") {
    return appointment;
  }

  const userId = currentUser._id.toString();
  const isDoctor = appointment.doctor?._id?.toString() === userId;
  const isPatient = appointment.patient?._id?.toString() === userId;

  return isDoctor || isPatient ? appointment : null;
}

router.get("/upcoming", authRequired, async (req, res) => {
  try {
    const now = new Date();
    const filters =
      req.user.role === "patient"
        ? { patient: req.user._id, dateTime: { $gte: now }, status: { $ne: "cancelled" } }
        : req.user.role === "doctor"
          ? { doctor: req.user._id, dateTime: { $gte: now }, status: { $ne: "cancelled" } }
          : { dateTime: { $gte: now }, status: { $ne: "cancelled" } };

    const appointments = await Appointment.find(filters)
      .populate("patient")
      .populate("doctor")
      .sort({ dateTime: 1 });

    return res.json(appointments.map(serializeAppointment));
  } catch (error) {
    console.error("Failed to fetch upcoming appointments.", error);
    return res.status(500).json({ message: "Failed to fetch appointments." });
  }
});

router.get("/doctor/today", authRequired, requireRole("doctor", "admin"), async (req, res) => {
  try {
    const doctorId = req.user.role === "doctor" ? req.user._id : req.query.doctorId;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctorId,
      dateTime: { $gte: start, $lte: end },
    })
      .populate("patient")
      .populate("doctor")
      .sort({ dateTime: 1 });

    return res.json(appointments.map(serializeAppointment));
  } catch (error) {
    console.error("Failed to fetch today's doctor appointments.", error);
    return res.status(500).json({ message: "Failed to fetch doctor's appointments." });
  }
});

router.get("/:appointmentId", authRequired, async (req, res) => {
  try {
    const appointment = await findAuthorizedAppointment(req.params.appointmentId, req.user);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.json({ appointment: serializeAppointment(appointment) });
  } catch (error) {
    console.error("Failed to fetch appointment.", error);
    return res.status(500).json({ message: "Failed to fetch appointment." });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const parsed = bookAppointmentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid appointment data.", issues: parsed.error.flatten() });
    }

    const { doctorId, consultationType, selectedDate, selectedSlot, reason, paymentMethod } = parsed.data;
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const patientId = req.user.role === "patient" ? req.user._id : req.body.patientId;
    const patient = await User.findOne({ _id: patientId, role: "patient" });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const dateTime = createAppointmentDateTime(selectedDate, selectedSlot);
    const fee =
      consultationType === "online"
        ? Math.min(doctor.doctorProfile?.onlineFee || 499, 499)
        : Math.min(doctor.doctorProfile?.offlineFee || 799, 799);

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      reason,
      type: consultationType,
      status: "confirmed",
      fee,
      paymentMethod,
      paymentStatus: "paid",
      dateTime,
    });

    patient.patientProfile = {
      ...patient.patientProfile,
      totalVisits: (patient.patientProfile?.totalVisits || 0) + 1,
      lastVisit: dateTime,
    };
    await patient.save();

    if (consultationType === "offline") {
      const queueDayStart = new Date(dateTime);
      queueDayStart.setHours(0, 0, 0, 0);
      const queueDayEnd = new Date(dateTime);
      queueDayEnd.setHours(23, 59, 59, 999);

      const queueCount = await QueueEntry.countDocuments({
        doctor: doctor._id,
        scheduledFor: {
          $gte: queueDayStart,
          $lte: queueDayEnd,
        },
      });

      await QueueEntry.create({
        doctor: doctor._id,
        patient: patient._id,
        token: queueCount + 1,
        reason,
        scheduledFor: queueDayStart,
        status: "waiting",
      });
    }

    await Notification.create([
      {
        recipient: patient._id,
        message: `Appointment booked with ${doctor.name} on ${selectedSlot}.`,
        type: "appointment",
      },
      {
        recipient: doctor._id,
        message: `New appointment booked by ${patient.name}.`,
        type: "appointment",
      },
    ]);

    const populated = await Appointment.findById(appointment._id).populate("patient").populate("doctor");
    return res.status(201).json({
      success: true,
      appointment: serializeAppointment(populated),
    });
  } catch (error) {
    console.error("Failed to book appointment.", error);
    return res.status(500).json({ message: "Failed to book appointment." });
  }
});

router.post("/:appointmentId/start", authRequired, async (req, res) => {
  try {
    const appointment = await findAuthorizedAppointment(req.params.appointmentId, req.user);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.type !== "online") {
      return res.status(400).json({ message: "Only video appointments can be started here." });
    }

    if (appointment.status === "confirmed") {
      appointment.status = "ongoing";
      await appointment.save();
    }

    return res.json({
      success: true,
      appointment: serializeAppointment(appointment),
    });
  } catch (error) {
    console.error("Failed to start appointment.", error);
    return res.status(500).json({ message: "Failed to start appointment." });
  }
});

export default router;

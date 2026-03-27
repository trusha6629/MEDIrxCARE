import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { QueueEntry } from "../models/QueueEntry.js";
import { Appointment } from "../models/Appointment.js";

const router = express.Router();

async function buildQueueStatus(doctorId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const entries = await QueueEntry.find({
    doctor: doctorId,
    scheduledFor: { $gte: start, $lte: end },
  })
    .populate("patient")
    .sort({ token: 1 });

  const serving = entries.find((entry) => entry.status === "serving");
  const waiting = entries.filter((entry) => entry.status === "waiting");
  const completed = entries.filter((entry) => entry.status === "completed");
  const currentServing = serving?.token || completed.at(-1)?.token || 0;
  const currentPatient = serving
    ? {
        name: serving.patient?.name || "Current Patient",
        token: serving.token,
        reason: serving.reason,
      }
    : null;
  const nextPatient = waiting[0]
    ? {
        name: waiting[0].patient?.name || "Waiting Patient",
        token: waiting[0].token,
        reason: waiting[0].reason,
      }
    : {
        name: "No one waiting",
        token: currentServing + 1,
        reason: "Queue clear",
      };

  return {
    currentServing,
    currentPatient,
    nextPatient,
    totalToday: entries.length,
    completed: completed.length,
    estimatedWaitTime: `${Math.max(waiting.length, 1) * 12} mins`,
    waitingList: waiting.slice(0, 5).map((entry) => ({
      token: entry.token,
      name: entry.patient?.name || "Patient",
      reason: entry.reason,
    })),
  };
}

router.get("/status", authRequired, async (req, res) => {
  try {
    let doctorId = req.query.doctorId;

    if (req.user.role === "doctor") {
      doctorId = req.user._id;
    }

    if (req.user.role === "patient") {
      const nextAppointment = await Appointment.findOne({
        patient: req.user._id,
        type: "offline",
        status: { $in: ["pending", "confirmed", "ongoing"] },
      }).sort({ dateTime: 1 });
      doctorId = nextAppointment?.doctor;
    }

    if (!doctorId) {
      const servingEntry = await QueueEntry.findOne().sort({ scheduledFor: -1 });
      doctorId = servingEntry?.doctor;
    }

    if (!doctorId) {
      return res.json({
        currentServing: 0,
        currentPatient: null,
        nextPatient: {
          name: "No queue yet",
          token: 1,
          reason: "Waiting for appointments",
        },
        totalToday: 0,
        completed: 0,
        estimatedWaitTime: "0 mins",
        waitingList: [],
      });
    }

    return res.json(await buildQueueStatus(doctorId));
  } catch (error) {
    console.error("Failed to fetch queue status.", error);
    return res.status(500).json({ message: "Failed to fetch queue status." });
  }
});

router.post("/next", authRequired, requireRole("doctor", "admin"), async (req, res) => {
  try {
    const doctorId = req.user.role === "doctor" ? req.user._id : req.body.doctorId;

    const serving = await QueueEntry.findOne({
      doctor: doctorId,
      status: "serving",
    }).sort({ token: 1 });

    if (serving) {
      serving.status = "completed";
      serving.completedAt = new Date();
      await serving.save();
    }

    const nextWaiting = await QueueEntry.findOne({
      doctor: doctorId,
      status: "waiting",
    }).sort({ token: 1 });

    if (nextWaiting) {
      nextWaiting.status = "serving";
      await nextWaiting.save();
    }

    return res.json({
      success: true,
      queue: await buildQueueStatus(doctorId),
    });
  } catch (error) {
    console.error("Failed to advance queue.", error);
    return res.status(500).json({ message: "Failed to advance queue." });
  }
});

export default router;

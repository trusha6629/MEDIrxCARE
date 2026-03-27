import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { Appointment } from "../models/Appointment.js";
import { Notification } from "../models/Notification.js";
import { QueueEntry } from "../models/QueueEntry.js";
import { User } from "../models/User.js";
import { formatRelativeTime } from "../utils/helpers.js";

const router = express.Router();

router.get("/patient", authRequired, requireRole("patient"), async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(5);
    const appointments = await Appointment.find({ patient: req.user._id }).sort({ createdAt: -1 }).limit(5).populate("doctor");

    return res.json({
      notifications: notifications.map((item) => ({
        id: item._id.toString(),
        message: item.message,
        time: formatRelativeTime(item.createdAt),
      })),
      recentActivity: appointments.map((appointment) => ({
        id: appointment._id.toString(),
        title: appointment.status === "completed" ? "Appointment Completed" : "Appointment Scheduled",
        description: `${appointment.doctor?.name || "Doctor"} • ${appointment.reason}`,
        time: formatRelativeTime(appointment.createdAt),
        type: appointment.status,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch patient dashboard.", error);
    return res.status(500).json({ message: "Failed to fetch patient dashboard." });
  }
});

router.get("/doctor", authRequired, requireRole("doctor"), async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [todaysAppointments, completedConsultations, waitingPatients] = await Promise.all([
      Appointment.countDocuments({
        doctor: req.user._id,
        dateTime: { $gte: start, $lte: end },
      }),
      Appointment.countDocuments({
        doctor: req.user._id,
        status: "completed",
      }),
      QueueEntry.countDocuments({
        doctor: req.user._id,
        status: "waiting",
      }),
    ]);

    return res.json({
      todaysAppointments,
      completedConsultations,
      waitingPatients,
      avgConsultationTime: 18,
    });
  } catch (error) {
    console.error("Failed to fetch doctor dashboard.", error);
    return res.status(500).json({ message: "Failed to fetch doctor dashboard." });
  }
});

router.get("/admin", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const [totalPatients, activeDoctors, pendingAppointments] = await Promise.all([
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: "doctor", status: "active" }),
      Appointment.countDocuments({ status: { $in: ["pending", "confirmed"] } }),
    ]);

    return res.json({
      totalPatients,
      activeDoctors,
      pendingAppointments,
      systemHealth: "Healthy",
    });
  } catch (error) {
    console.error("Failed to fetch admin dashboard.", error);
    return res.status(500).json({ message: "Failed to fetch admin dashboard." });
  }
});

export default router;

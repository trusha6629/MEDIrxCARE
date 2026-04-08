import bcrypt from "bcryptjs";
import express from "express";
import { z } from "zod";
import { authRequired, requireRole } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { getInitials, serializeDoctor } from "../utils/helpers.js";

const router = express.Router();

const createDoctorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  specialization: z.string().min(2),
  experience: z.string().min(1),
  location: z.string().min(2),
  availability: z.string().min(2),
});

router.get("/", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const specialization = String(req.query.specialization || "").trim();
    const filters = {
      role: "doctor",
      ...(specialization && specialization !== "All"
        ? { "doctorProfile.specialization": new RegExp(`^${specialization}$`, "i") }
        : {}),
      ...(search
        ? {
            $or: [
              { name: new RegExp(search, "i") },
              { email: new RegExp(search, "i") },
              { "doctorProfile.specialization": new RegExp(search, "i") },
            ],
          }
        : {}),
    };

    const doctors = await User.find(filters).sort({ createdAt: -1 });
    return res.json(doctors.map(serializeDoctor));
  } catch (error) {
    console.error("Failed to fetch doctors.", error);
    return res.status(500).json({ message: "Failed to fetch doctors." });
  }
});

router.post("/", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const parsed = createDoctorSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid doctor data.", issues: parsed.error.flatten() });
    }

    const { name, email, phone, specialization, experience, location, availability } = parsed.data;
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: "A doctor with that email already exists." });
    }

    const temporaryPassword = "Doctor@123";
    const doctor = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash: await bcrypt.hash(temporaryPassword, 10),
      role: "doctor",
      avatar: getInitials(name),
      doctorProfile: {
        specialization,
        experienceYears: Number.parseInt(experience, 10) || 0,
        location,
        availability,
        onlineFee: 499,
        offlineFee: 799,
        rating: 4.8,
        reviews: 0,
        patientsCount: 0,
        nextAvailable: "Tomorrow, 10:30 AM",
      },
    });

    return res.status(201).json({
      doctor: serializeDoctor(doctor),
      temporaryPassword,
    });
  } catch (error) {
    console.error("Failed to create doctor.", error);
    return res.status(500).json({ message: "Failed to create doctor." });
  }
});

export default router;

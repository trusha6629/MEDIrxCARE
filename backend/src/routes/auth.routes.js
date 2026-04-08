import bcrypt from "bcryptjs";
import express from "express";
import { z } from "zod";
import { authRequired, createToken } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { getInitials, sanitizeUser } from "../utils/helpers.js";

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional().default(""),
  role: z.enum(["patient", "doctor", "admin"]).optional().default("patient"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid registration data.", issues: parsed.error.flatten() });
    }

    const { name, email, password, phone, role } = parsed.data;
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const baseUser = {
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role,
      avatar: getInitials(name),
    };

    const roleSpecificData =
      role === "doctor"
        ? {
            doctorProfile: {
              specialization: "General Physician",
              experienceYears: 0,
              location: "OPD Wing",
              availability: "Mon-Sat, 10:00 AM - 6:00 PM",
            },
          }
        : role === "admin"
          ? {
              adminProfile: {
                title: "Operations Lead",
                organizationName: "MEDIrxCARE Hospitals",
              },
            }
          : {
              patientProfile: {
                age: 0,
                gender: "Unknown",
                bloodGroup: "Unknown",
                address: "",
                totalVisits: 0,
              },
            };

    const user = await User.create({
      ...baseUser,
      ...roleSpecificData,
    });

    const token = createToken(user);
    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Registration failed.", error);
    return res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid login data.", issues: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);
    return res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login failed.", error);
    return res.status(500).json({ message: "Login failed." });
  }
});

router.get("/me", authRequired, async (req, res) => {
  return res.json({ user: req.auth });
});

export default router;

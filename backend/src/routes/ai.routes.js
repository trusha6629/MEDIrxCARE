import express from "express";
import { z } from "zod";
import { authRequired } from "../middleware/auth.js";
import { generateAiDoctorAssessment, generateChatbotReply } from "../services/ai.service.js";

const router = express.Router();

const aiDoctorSchema = z.object({
  issue: z.string().min(3),
});

const chatbotSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        text: z.string(),
        sender: z.enum(["user", "ai"]),
      }),
    )
    .optional()
    .default([]),
});

router.post("/doctor", authRequired, async (req, res) => {
  try {
    const parsed = aiDoctorSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid AI Doctor request.", issues: parsed.error.flatten() });
    }

    const result = await generateAiDoctorAssessment(parsed.data.issue);
    return res.json(result);
  } catch (error) {
    console.error("AI Doctor request failed.", error);
    return res.status(500).json({ message: "Failed to generate AI doctor guidance." });
  }
});

router.post("/chatbot", authRequired, async (req, res) => {
  try {
    const parsed = chatbotSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid chatbot request.", issues: parsed.error.flatten() });
    }

    const reply = await generateChatbotReply({
      message: parsed.data.message,
      history: parsed.data.history,
      role: req.user.role,
    });

    return res.json({ reply });
  } catch (error) {
    console.error("Chatbot request failed.", error);
    return res.status(500).json({ message: "Failed to generate chatbot reply." });
  }
});

export default router;

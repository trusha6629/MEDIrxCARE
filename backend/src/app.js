import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import aiRoutes from "./routes/ai.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import doctorsRoutes from "./routes/doctors.routes.js";
import patientsRoutes from "./routes/patients.routes.js";
import queueRoutes from "./routes/queue.routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin.split(",").map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/", (_req, res) => {
    res.json({
      name: "MediSense Backend",
      status: "ok",
      health: "/api/health",
    });
  });

  app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
    res.status(204).end();
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "medisense-backend",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/doctors", doctorsRoutes);
  app.use("/api/patients", patientsRoutes);
  app.use("/api/appointments", appointmentsRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/queue", queueRoutes);
  app.use("/api/ai", aiRoutes);

  app.use((req, res) => {
    res.status(404).json({
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  app.use((err, _req, res, _next) => {
    console.error("Unhandled backend error.", err);
    res.status(500).json({ message: "An unexpected server error occurred." });
  });

  return app;
}

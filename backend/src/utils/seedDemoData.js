import bcrypt from "bcryptjs";
import { Appointment } from "../models/Appointment.js";
import { Notification } from "../models/Notification.js";
import { QueueEntry } from "../models/QueueEntry.js";
import { User } from "../models/User.js";
import { createAppointmentDateTime, getInitials } from "./helpers.js";

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function seedDemoData() {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@medisense.ai",
    phone: "+1 (555) 999-0000",
    passwordHash,
    role: "admin",
    avatar: "AU",
    adminProfile: {
      title: "System Administrator",
      organizationName: "MediSense Health AI",
    },
  });

  const doctors = await User.insertMany([
    {
      name: "Dr. Sarah Miller",
      email: "sarah.miller@medisense.ai",
      phone: "+1 (555) 123-4567",
      passwordHash,
      role: "doctor",
      avatar: "SM",
      doctorProfile: {
        specialization: "Cardiology",
        experienceYears: 15,
        location: "Building A, Floor 3",
        availability: "Mon-Fri, 9:00 AM - 5:00 PM",
        onlineFee: 50,
        offlineFee: 80,
        rating: 4.9,
        reviews: 245,
        patientsCount: 847,
        nextAvailable: "Today, 3:00 PM",
        bio: "Cardiologist focused on preventive and long-term heart care.",
        licenseNumber: "MED-7829-CA",
      },
    },
    {
      name: "Dr. Michael Chen",
      email: "michael.chen@medisense.ai",
      phone: "+1 (555) 234-5678",
      passwordHash,
      role: "doctor",
      avatar: "MC",
      doctorProfile: {
        specialization: "General Physician",
        experienceYears: 12,
        location: "Building B, Floor 2",
        availability: "Mon-Sat, 10:00 AM - 6:00 PM",
        onlineFee: 40,
        offlineFee: 65,
        rating: 4.8,
        reviews: 320,
        patientsCount: 623,
        nextAvailable: "Tomorrow, 10:00 AM",
        bio: "General physician supporting everyday acute and preventive care.",
        licenseNumber: "MED-2381-NY",
      },
    },
  ]);

  const patients = await User.insertMany([
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 111-2222",
      passwordHash,
      role: "patient",
      avatar: "JD",
      patientProfile: {
        age: 45,
        gender: "Male",
        bloodGroup: "O+",
        address: "123 Health Street, New York, NY",
        totalVisits: 12,
        lastVisit: addDays(-20),
      },
    },
    {
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      phone: "+1 (555) 222-3333",
      passwordHash,
      role: "patient",
      avatar: "EW",
      patientProfile: {
        age: 32,
        gender: "Female",
        bloodGroup: "A+",
        address: "456 Wellness Ave, Chicago, IL",
        totalVisits: 8,
        lastVisit: addDays(-18),
      },
    },
  ]);

  const john = patients[0];
  const sarahDoctor = doctors[0];
  const michaelDoctor = doctors[1];

  await Appointment.insertMany([
    {
      patient: john._id,
      doctor: sarahDoctor._id,
      reason: "Follow-up Consultation",
      type: "online",
      status: "confirmed",
      fee: sarahDoctor.doctorProfile.onlineFee,
      dateTime: createAppointmentDateTime(addDays(1), "10:30 AM"),
    },
    {
      patient: john._id,
      doctor: michaelDoctor._id,
      reason: "General Check-up",
      type: "offline",
      status: "pending",
      fee: michaelDoctor.doctorProfile.offlineFee,
      dateTime: createAppointmentDateTime(addDays(3), "02:00 PM"),
    },
    {
      patient: patients[1]._id,
      doctor: sarahDoctor._id,
      reason: "Cardiac Review",
      type: "offline",
      status: "completed",
      fee: sarahDoctor.doctorProfile.offlineFee,
      dateTime: createAppointmentDateTime(new Date(), "09:30 AM"),
    },
  ]);

  await QueueEntry.insertMany([
    {
      doctor: sarahDoctor._id,
      patient: john._id,
      token: 25,
      reason: "Follow-up Consultation",
      scheduledFor: new Date(),
      status: "waiting",
    },
    {
      doctor: sarahDoctor._id,
      patient: patients[1]._id,
      token: 24,
      reason: "Cardiac Review",
      scheduledFor: new Date(),
      status: "serving",
    },
    {
      doctor: sarahDoctor._id,
      patient: john._id,
      token: 23,
      reason: "Vitals Check",
      scheduledFor: new Date(),
      status: "completed",
      completedAt: new Date(),
    },
  ]);

  await Notification.insertMany([
    {
      recipient: john._id,
      message: "Take your morning medication - Aspirin 100mg",
      type: "medication",
      createdAt: addDays(-1),
      updatedAt: addDays(-1),
    },
    {
      recipient: john._id,
      message: "Your lab report is ready to view",
      type: "report",
      createdAt: addDays(-2),
      updatedAt: addDays(-2),
    },
    {
      recipient: sarahDoctor._id,
      message: "Two new follow-up appointments were added to your queue.",
      type: "schedule",
      createdAt: addDays(-1),
      updatedAt: addDays(-1),
    },
    {
      recipient: admin._id,
      message: "Daily operations report is ready for review.",
      type: "system",
      createdAt: addDays(-1),
      updatedAt: addDays(-1),
    },
  ]);

  const allUsers = await User.find();
  await Promise.all(
    allUsers.map((user) => {
      if (!user.avatar) {
        user.avatar = getInitials(user.name);
      }
      return user.save();
    }),
  );
}

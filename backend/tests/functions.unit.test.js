import assert from "node:assert/strict";
import test from "node:test";
import {
  createAppointmentDateTime,
  getInitials,
  sanitizeUser,
  serializeAppointment,
  serializeDoctor,
  serializePatient,
} from "../src/utils/helpers.js";

test("getInitials returns initials for a full name", () => {
  assert.equal(getInitials("Rohan Verma"), "RV");
});

test("createAppointmentDateTime handles afternoon times", () => {
  const date = createAppointmentDateTime("2026-04-08", "4:30 PM");

  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 3);
  assert.equal(date.getDate(), 8);
  assert.equal(date.getHours(), 16);
  assert.equal(date.getMinutes(), 30);
});

test("createAppointmentDateTime handles midnight correctly", () => {
  const date = createAppointmentDateTime("2026-04-08", "12:05 AM");

  assert.equal(date.getHours(), 0);
  assert.equal(date.getMinutes(), 5);
});

test("sanitizeUser returns only safe public fields", () => {
  const user = {
    _id: { toString: () => "user-1" },
    name: "Aditi Sharma",
    email: "aditi@example.com",
    role: "admin",
    phone: "+91 98765 40000",
    avatar: "",
    status: "active",
    passwordHash: "hidden",
  };

  assert.deepEqual(sanitizeUser(user), {
    id: "user-1",
    name: "Aditi Sharma",
    email: "aditi@example.com",
    role: "admin",
    phone: "+91 98765 40000",
    avatar: "AS",
    status: "active",
  });
});

test("serializeDoctor maps doctor profile data for the frontend", () => {
  const doctor = {
    _id: { toString: () => "doctor-1" },
    name: "Dr. Aarav Mehta",
    email: "aarav.mehta@medirxcare.in",
    phone: "+91 98765 41001",
    status: "active",
    avatar: "AM",
    doctorProfile: {
      specialization: "Cardiology",
      experienceYears: 14,
      patientsCount: 847,
      location: "Heart Care Block, Level 3",
      availability: "Mon-Sat, 9:30 AM - 5:30 PM",
      rating: 4.9,
      reviews: 245,
      onlineFee: 1200,
      offlineFee: 1800,
      nextAvailable: "Today, 4:30 PM",
      bio: "Cardiologist focused on preventive care.",
    },
  };

  assert.deepEqual(serializeDoctor(doctor), {
    id: "doctor-1",
    name: "Dr. Aarav Mehta",
    email: "aarav.mehta@medirxcare.in",
    phone: "+91 98765 41001",
    specialization: "Cardiology",
    specialty: "Cardiology",
    experience: "14 years",
    patients: 847,
    status: "active",
    location: "Heart Care Block, Level 3",
    avatar: "AM",
    availability: "Mon-Sat, 9:30 AM - 5:30 PM",
    rating: 4.9,
    reviews: 245,
    onlineFee: 499,
    offlineFee: 799,
    nextAvailable: "Today, 4:30 PM",
    bio: "Cardiologist focused on preventive care.",
  });
});

test("serializePatient maps patient profile data for the frontend", () => {
  const patient = {
    _id: { toString: () => "patient-1" },
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    phone: "+91 98765 42001",
    status: "active",
    avatar: "RV",
    createdAt: new Date("2026-04-01T10:00:00"),
    patientProfile: {
      age: 42,
      gender: "Male",
      bloodGroup: "O+",
      lastVisit: new Date("2026-04-03T12:00:00"),
      totalVisits: 12,
      address: "Indiranagar, Bengaluru, Karnataka",
    },
  };

  const serialized = serializePatient(patient);

  assert.equal(serialized.id, "patient-1");
  assert.equal(serialized.name, "Rohan Verma");
  assert.equal(serialized.age, 42);
  assert.equal(serialized.gender, "Male");
  assert.equal(serialized.bloodGroup, "O+");
  assert.equal(serialized.totalVisits, 12);
  assert.equal(serialized.address, "Indiranagar, Bengaluru, Karnataka");
});

test("serializeAppointment formats appointment details for frontend cards", () => {
  const appointment = {
    _id: { toString: () => "appointment-1" },
    doctor: {
      name: "Dr. Kavya Iyer",
      doctorProfile: {
        specialization: "General Physician",
      },
    },
    patient: {
      name: "Ananya Patel",
    },
    dateTime: new Date(2026, 3, 8, 10, 30),
    type: "offline",
    status: "confirmed",
    reason: "Follow-up consultation",
  };

  const serialized = serializeAppointment(appointment);

  assert.equal(serialized.id, "appointment-1");
  assert.equal(serialized.doctor, "Dr. Kavya Iyer");
  assert.equal(serialized.patient, "Ananya Patel");
  assert.equal(serialized.specialty, "General Physician");
  assert.equal(serialized.type, "In-Person");
  assert.equal(serialized.mode, "In-Person");
  assert.equal(serialized.status, "confirmed");
  assert.equal(serialized.reason, "Follow-up consultation");
  assert.match(serialized.date, /2026/);
  assert.ok(serialized.time.length > 0);
});

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

async function migrateLegacyDemoUser(legacyEmail, nextState) {
  const legacyUser = await User.findOne({ email: legacyEmail });

  if (!legacyUser) {
    return null;
  }

  const emailConflict =
    nextState.email && nextState.email !== legacyEmail
      ? await User.findOne({ email: nextState.email, _id: { $ne: legacyUser._id } })
      : null;

  const update = {
    name: nextState.name,
    phone: nextState.phone,
    avatar: getInitials(nextState.name),
    ...(emailConflict ? {} : { email: nextState.email }),
    ...(nextState.adminProfile ? { adminProfile: nextState.adminProfile } : {}),
    ...(nextState.doctorProfile ? { doctorProfile: nextState.doctorProfile } : {}),
    ...(nextState.patientProfile ? { patientProfile: nextState.patientProfile } : {}),
  };

  await User.updateOne({ _id: legacyUser._id }, { $set: update });
  return User.findById(legacyUser._id);
}

async function migrateLegacyDemoUsers() {
  await migrateLegacyDemoUser("admin@medisense.ai", {
    name: "Aditi Sharma",
    email: "admin@medirxcare.in",
    phone: "+91 98765 40000",
    adminProfile: {
      title: "Operations Lead",
      organizationName: "MEDIrxCARE Hospitals",
    },
  });

  await migrateLegacyDemoUser("sarah.miller@medisense.ai", {
    name: "Dr. Aarav Mehta",
    email: "aarav.mehta@medirxcare.in",
    phone: "+91 98765 41001",
    doctorProfile: {
      specialization: "Cardiology",
      experienceYears: 14,
      location: "Heart Care Block, Level 3",
      availability: "Mon-Sat, 9:30 AM - 5:30 PM",
      onlineFee: 499,
      offlineFee: 799,
      rating: 4.9,
      reviews: 245,
      patientsCount: 847,
      nextAvailable: "Today, 4:30 PM",
      bio: "Cardiologist focused on preventive care, diagnostics, and long-term heart health.",
      licenseNumber: "MCI-DL-7829",
    },
  });

  await migrateLegacyDemoUser("michael.chen@medisense.ai", {
    name: "Dr. Kavya Iyer",
    email: "kavya.iyer@medirxcare.in",
    phone: "+91 98765 41002",
    doctorProfile: {
      specialization: "General Physician",
      experienceYears: 11,
      location: "Primary Care Wing, Level 2",
      availability: "Mon-Sat, 10:00 AM - 6:00 PM",
      onlineFee: 399,
      offlineFee: 649,
      rating: 4.8,
      reviews: 320,
      patientsCount: 623,
      nextAvailable: "Tomorrow, 10:30 AM",
      bio: "General physician supporting everyday acute care, chronic follow-up, and preventive medicine.",
      licenseNumber: "MCI-TN-2381",
    },
  });

  await migrateLegacyDemoUser("john.doe@example.com", {
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    phone: "+91 98765 42001",
    patientProfile: {
      age: 42,
      gender: "Male",
      bloodGroup: "O+",
      address: "Indiranagar, Bengaluru, Karnataka",
      totalVisits: 12,
      lastVisit: addDays(-20),
    },
  });

  await migrateLegacyDemoUser("emma.wilson@example.com", {
    name: "Ananya Patel",
    email: "ananya.patel@example.com",
    phone: "+91 98765 42002",
    patientProfile: {
      age: 31,
      gender: "Female",
      bloodGroup: "A+",
      address: "Bandra West, Mumbai, Maharashtra",
      totalVisits: 8,
      lastVisit: addDays(-18),
    },
  });
}

async function reconcileCurrentDemoUsers() {
  await User.updateOne(
    { email: "aarav.mehta@medirxcare.in" },
    {
      $set: {
        phone: "+91 98765 41001",
        doctorProfile: {
          specialization: "Cardiology",
          experienceYears: 14,
          location: "Heart Care Block, Level 3",
          availability: "Mon-Sat, 9:30 AM - 5:30 PM",
          onlineFee: 499,
          offlineFee: 799,
          rating: 4.9,
          reviews: 245,
          patientsCount: 847,
          nextAvailable: "Today, 4:30 PM",
          bio: "Cardiologist focused on preventive care, diagnostics, and long-term heart health.",
          licenseNumber: "MCI-DL-7829",
        },
      },
    },
  );

  await User.updateOne(
    { email: "kavya.iyer@medirxcare.in" },
    {
      $set: {
        phone: "+91 98765 41002",
        doctorProfile: {
          specialization: "General Physician",
          experienceYears: 11,
          location: "Primary Care Wing, Level 2",
          availability: "Mon-Sat, 10:00 AM - 6:00 PM",
          onlineFee: 399,
          offlineFee: 649,
          rating: 4.8,
          reviews: 320,
          patientsCount: 623,
          nextAvailable: "Tomorrow, 10:30 AM",
          bio: "General physician supporting everyday acute care, chronic follow-up, and preventive medicine.",
          licenseNumber: "MCI-TN-2381",
        },
      },
    },
  );
}

export async function seedDemoData() {
  await migrateLegacyDemoUsers();
  await reconcileCurrentDemoUsers();

  const userCount = await User.countDocuments();

  if (userCount > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await User.create({
    name: "Aditi Sharma",
    email: "admin@medirxcare.in",
    phone: "+91 98765 40000",
    passwordHash,
    role: "admin",
    avatar: "AS",
    adminProfile: {
      title: "Operations Lead",
      organizationName: "MEDIrxCARE Hospitals",
    },
  });

  const doctors = await User.insertMany([
    {
      name: "Dr. Aarav Mehta",
      email: "aarav.mehta@medirxcare.in",
      phone: "+91 98765 41001",
      passwordHash,
      role: "doctor",
      avatar: "AM",
      doctorProfile: {
        specialization: "Cardiology",
        experienceYears: 14,
        location: "Heart Care Block, Level 3",
        availability: "Mon-Sat, 9:30 AM - 5:30 PM",
        onlineFee: 499,
        offlineFee: 799,
        rating: 4.9,
        reviews: 245,
        patientsCount: 847,
        nextAvailable: "Today, 4:30 PM",
        bio: "Cardiologist focused on preventive care, diagnostics, and long-term heart health.",
        licenseNumber: "MCI-DL-7829",
      },
    },
    {
      name: "Dr. Kavya Iyer",
      email: "kavya.iyer@medirxcare.in",
      phone: "+91 98765 41002",
      passwordHash,
      role: "doctor",
      avatar: "KI",
      doctorProfile: {
        specialization: "General Physician",
        experienceYears: 11,
        location: "Primary Care Wing, Level 2",
        availability: "Mon-Sat, 10:00 AM - 6:00 PM",
        onlineFee: 399,
        offlineFee: 649,
        rating: 4.8,
        reviews: 320,
        patientsCount: 623,
        nextAvailable: "Tomorrow, 10:30 AM",
        bio: "General physician supporting everyday acute care, chronic follow-up, and preventive medicine.",
        licenseNumber: "MCI-TN-2381",
      },
    },
  ]);

  const patients = await User.insertMany([
    {
      name: "Rohan Verma",
      email: "rohan.verma@example.com",
      phone: "+91 98765 42001",
      passwordHash,
      role: "patient",
      avatar: "RV",
      patientProfile: {
        age: 42,
        gender: "Male",
        bloodGroup: "O+",
        address: "Indiranagar, Bengaluru, Karnataka",
        totalVisits: 12,
        lastVisit: addDays(-20),
      },
    },
    {
      name: "Ananya Patel",
      email: "ananya.patel@example.com",
      phone: "+91 98765 42002",
      passwordHash,
      role: "patient",
      avatar: "AP",
      patientProfile: {
        age: 31,
        gender: "Female",
        bloodGroup: "A+",
        address: "Bandra West, Mumbai, Maharashtra",
        totalVisits: 8,
        lastVisit: addDays(-18),
      },
    },
  ]);

  const rohan = patients[0];
  const aaravDoctor = doctors[0];
  const kavyaDoctor = doctors[1];

  await Appointment.insertMany([
    {
      patient: rohan._id,
      doctor: aaravDoctor._id,
      reason: "Heart Health Follow-up",
      type: "online",
      status: "confirmed",
      fee: aaravDoctor.doctorProfile.onlineFee,
      dateTime: createAppointmentDateTime(addDays(1), "10:30 AM"),
    },
    {
      patient: rohan._id,
      doctor: kavyaDoctor._id,
      reason: "General Wellness Check",
      type: "offline",
      status: "pending",
      fee: kavyaDoctor.doctorProfile.offlineFee,
      dateTime: createAppointmentDateTime(addDays(3), "02:00 PM"),
    },
    {
      patient: patients[1]._id,
      doctor: aaravDoctor._id,
      reason: "Cardiac Review",
      type: "offline",
      status: "completed",
      fee: aaravDoctor.doctorProfile.offlineFee,
      dateTime: createAppointmentDateTime(new Date(), "09:30 AM"),
    },
  ]);

  await QueueEntry.insertMany([
    {
      doctor: aaravDoctor._id,
      patient: rohan._id,
      token: 25,
      reason: "Heart Health Follow-up",
      scheduledFor: new Date(),
      status: "waiting",
    },
    {
      doctor: aaravDoctor._id,
      patient: patients[1]._id,
      token: 24,
      reason: "Cardiac Review",
      scheduledFor: new Date(),
      status: "serving",
    },
    {
      doctor: aaravDoctor._id,
      patient: rohan._id,
      token: 23,
      reason: "Vitals Check",
      scheduledFor: new Date(),
      status: "completed",
      completedAt: new Date(),
    },
  ]);

  await Notification.insertMany([
    {
      recipient: rohan._id,
      message: "Take your morning medicine after breakfast.",
      type: "medication",
      createdAt: addDays(-1),
      updatedAt: addDays(-1),
    },
    {
      recipient: rohan._id,
      message: "Your latest lab report is ready to review.",
      type: "report",
      createdAt: addDays(-2),
      updatedAt: addDays(-2),
    },
    {
      recipient: aaravDoctor._id,
      message: "Two follow-up consultations were added to your queue.",
      type: "schedule",
      createdAt: addDays(-1),
      updatedAt: addDays(-1),
    },
    {
      recipient: admin._id,
      message: "Today's operations summary is ready for review.",
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

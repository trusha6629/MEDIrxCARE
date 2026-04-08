import assert from "node:assert/strict";
import { before, test } from "node:test";
import {
  createUniqueReason,
  getTomorrowDateLabel,
  jsonRequest,
  resolveApiBaseUrl,
} from "./test-server.js";

let baseUrl;

before(async () => {
  baseUrl = await resolveApiBaseUrl();
});

test("register, login, browse doctors, book appointment, and view patient dashboard", async () => {
  const login = await jsonRequest(baseUrl, "/auth/login", {
    method: "POST",
    body: {
      password: "Password123!",
      email: "rohan.verma@example.com",
    },
  });

  assert.equal(login.status, 200);
  assert.ok(login.json.token);

  const doctors = await jsonRequest(baseUrl, "/doctors");
  assert.equal(doctors.status, 200);
  assert.ok(Array.isArray(doctors.json));
  assert.ok(doctors.json.length > 0);

  const appointmentReason = createUniqueReason("Integration test appointment");

  const booking = await jsonRequest(baseUrl, "/appointments", {
    method: "POST",
    token: login.json.token,
    body: {
      doctorId: doctors.json[0].id,
      consultationType: "offline",
      selectedDate: getTomorrowDateLabel(),
      selectedSlot: "10:30 AM",
      reason: appointmentReason,
    },
  });

  assert.equal(booking.status, 201);
  assert.equal(booking.json.success, true);
  assert.equal(booking.json.appointment.reason, appointmentReason);

  const upcoming = await jsonRequest(baseUrl, "/appointments/upcoming", {
    token: login.json.token,
  });

  assert.equal(upcoming.status, 200);
  assert.equal(
    upcoming.json.some((appointment) => appointment.reason === appointmentReason),
    true,
  );

  const queue = await jsonRequest(baseUrl, "/queue/status", {
    token: login.json.token,
  });

  assert.equal(queue.status, 200);
  assert.ok("currentServing" in queue.json);
  assert.ok("nextPatient" in queue.json);

  const dashboard = await jsonRequest(baseUrl, "/dashboard/patient", {
    token: login.json.token,
  });

  assert.equal(dashboard.status, 200);
  assert.ok(Array.isArray(dashboard.json.recentActivity));
  assert.equal(dashboard.json.recentActivity.length > 0, true);
});

import assert from "node:assert/strict";
import { before, test } from "node:test";
import { jsonRequest, resolveApiBaseUrl } from "./test-server.js";

let baseUrl;

before(async () => {
  baseUrl = await resolveApiBaseUrl();
});

test("GET /health returns backend status metadata", async () => {
  const response = await jsonRequest(baseUrl, "/health");

  assert.equal(response.status, 200);
  assert.equal(response.json.status, "ok");
  assert.equal(response.json.service, "medirxcare-backend");
  assert.ok(response.json.timestamp);
});

test("GET /appointments/upcoming rejects unauthenticated requests", async () => {
  const response = await jsonRequest(baseUrl, "/appointments/upcoming");

  assert.equal(response.status, 401);
  assert.equal(response.json.message, "Authentication required.");
});

test("POST /auth/login returns a token for the seeded demo patient", async () => {
  const response = await jsonRequest(baseUrl, "/auth/login", {
    method: "POST",
    body: {
      email: "rohan.verma@example.com",
      password: "Password123!",
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.json.user.name, "Rohan Verma");
  assert.equal(response.json.user.role, "patient");
  assert.ok(typeof response.json.token === "string");
  assert.ok(response.json.token.length > 20);
});

test("GET /doctors returns the seeded doctor catalogue", async () => {
  const response = await jsonRequest(baseUrl, "/doctors");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.json));
  assert.ok(response.json.length >= 2);
  assert.equal(response.json[0].email.includes("@"), true);
});

test("GET /queue/status returns queue payload for an authenticated patient", async () => {
  const login = await jsonRequest(baseUrl, "/auth/login", {
    method: "POST",
    body: {
      email: "rohan.verma@example.com",
      password: "Password123!",
    },
  });

  const response = await jsonRequest(baseUrl, "/queue/status", {
    token: login.json.token,
  });

  assert.equal(response.status, 200);
  assert.ok("currentServing" in response.json);
  assert.ok("waitingList" in response.json);
  assert.ok(Array.isArray(response.json.waitingList));
});

const baseUrlCandidates = [
  process.env.TEST_BASE_URL,
  "http://localhost:5001/api",
  "http://127.0.0.1:5001/api",
].filter(Boolean);

export async function resolveApiBaseUrl() {
  for (const baseUrl of baseUrlCandidates) {
    try {
      const response = await fetch(`${baseUrl}/health`);

      if (response.ok) {
        return baseUrl;
      }
    } catch (_error) {
      continue;
    }
  }

  throw new Error(
    "Could not reach the backend test server. Start the backend with `npm run dev:backend` and try again.",
  );
}

export async function jsonRequest(baseUrl, path, { method = "GET", token, body } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();

  return {
    status: response.status,
    json: text ? JSON.parse(text) : null,
  };
}

export function createUniqueReason(prefix) {
  return `${prefix} ${Date.now()}`;
}

export function getTomorrowDateLabel() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

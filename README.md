# MediSense

MediSense is now organized as a full-stack project with a React/Vite frontend and an Express/MongoDB backend.

## Structure

```text
.
├── frontend/    # React + TypeScript + Vite app
├── backend/     # Express + MongoDB API + OpenAI integration
├── docker-compose.yml
└── package.json # root helper scripts
```

## Features Included

- Patient, doctor, and admin dashboards
- JWT-based authentication
- MongoDB-backed doctors, patients, appointments, notifications, and queue data
- AI Doctor endpoint for symptom/problem guidance
- AI-powered floating chatbot endpoint
- Admin create-doctor and create-patient flows
- Deployment-ready Dockerfiles for frontend and backend

## Local Setup

1. Copy env files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

2. Start MongoDB locally or point `MONGODB_URI` to MongoDB Atlas.

3. Install dependencies:

```bash
npm install --prefix frontend
npm install --prefix backend
```

4. Run the backend:

```bash
npm run dev:backend
```

5. Run the frontend:

```bash
npm run dev:frontend
```

## Demo Accounts

These are seeded automatically when the backend starts with an empty database:

- Admin: `admin@medisense.ai` / `Password123!`
- Doctor: `sarah.miller@medisense.ai` / `Password123!`
- Patient: `john.doe@example.com` / `Password123!`

## AI Setup

To enable real OpenAI-backed AI instead of the built-in fallback logic, set these in `backend/.env`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5-mini
```

Without an API key, the AI Doctor page and chatbot still work with deterministic fallback guidance.

## Docker Deployment

Run the stack with:

```bash
docker compose up --build
```

This brings up:

- MongoDB on `27017`
- Backend on `5000`
- Frontend on `8080`

## Root Scripts

- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build`
- `npm run start:backend`
- `npm run seed:backend`

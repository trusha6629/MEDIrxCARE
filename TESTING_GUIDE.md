# Testing Guide

Use these commands from the project root:

```bash
npm run dev:backend
npm run test:functions
npm run test:api
npm run test:integration
```

What each command shows:

- `npm run test:functions`: unit testing of backend helper functions
- `npm run test:api`: API endpoint testing for health, auth, doctors, and queue routes
- `npm run test:integration`: end-to-end flow covering register, login, doctor listing, appointment booking, queue lookup, and dashboard retrieval

Best screenshot sequence for your report:

1. Open a terminal in the project root.
2. Start the backend with `npm run dev:backend`.
3. Open a second terminal tab in the same project folder.
4. Run `npm run test:functions` and take a screenshot when the green checks appear.
5. Run `npm run test:api` and take a screenshot of the endpoint test results.
6. Run `npm run test:integration` and take a screenshot of the full workflow test.

Suggested captions for the report:

- `Figure X: Unit testing of backend helper functions`
- `Figure Y: API endpoint testing of authentication, health, and queue services`
- `Figure Z: Integration testing of the patient appointment booking workflow`

Notes:

- These tests use the backend code and local MongoDB connection already configured in the project.
- The API and integration tests use the running backend at `http://localhost:5001/api`.
- The integration test books a real demo appointment for the seeded patient account, so it exercises the live workflow end to end.

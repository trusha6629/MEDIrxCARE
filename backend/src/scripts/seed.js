import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { seedDemoData } from "../utils/seedDemoData.js";

async function run() {
  try {
    await connectDatabase();
    await seedDemoData();
    console.log("Seed completed.");
  } catch (error) {
    console.error("Seed failed.", error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

run();

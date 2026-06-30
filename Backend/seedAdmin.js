// One-time script to create an Admin account.
// Run manually: node seedAdmin.js
// Never exposed via any API route — Admin accounts are not created through
// the website's signup form, on purpose (see userController.js -> register).
//
// Reads credentials from config/config.env. Add these lines there before running:
//   ADMIN_NAME=Your Name
//   ADMIN_EMAIL=admin@example.com
//   ADMIN_PHONE=9999999999
//   ADMIN_PASSWORD=choose-a-strong-password

import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/userSchema.js";

dotenv.config({ path: "./config/config.env" });

const run = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD, MONGO_URI } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PHONE || !ADMIN_PASSWORD) {
    console.error(
      "Missing ADMIN_NAME / ADMIN_EMAIL / ADMIN_PHONE / ADMIN_PASSWORD in config/config.env"
    );
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { dbName: "JOB_SEEKING_WEBSITE" });

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.error(`A user with email ${ADMIN_EMAIL} already exists (role: ${existing.role}).`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const admin = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    phone: ADMIN_PHONE,
    password: ADMIN_PASSWORD, // hashed automatically by the schema's pre-save hook
    role: "Admin",
  });

  console.log(`Admin account created: ${admin.email}`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});

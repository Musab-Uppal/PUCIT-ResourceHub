/*
 * Usage: node scripts/seedAdmin.js
 *
 * Creates the one seeded admin account using ADMIN_EMAIL + ADMIN_PASSWORD from .env.
 * Safe to run multiple times — it checks for an existing admin first.
 * There is intentionally no API endpoint to create admin accounts.
 */

require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const User = require("../models/User");

const seed = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      dbName: "pucit-hub",
    });
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      if (existing.role === "admin") {
        console.log("ℹ️  Admin already exists:", existing.email);
      } else {
        // Edge case: someone registered with the admin email before seeding
        existing.role = "admin";
        await existing.save();
        console.log("✅ Upgraded existing user to admin:", existing.email);
      }
    } else {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });
      console.log("✅ Admin account created:", process.env.ADMIN_EMAIL);
    }
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();

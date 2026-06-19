const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
      dbName: "pucit-hub", // explicit dbName avoids using the default 'test' db
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // crash fast — no point running without a DB
  }
};

module.exports = connectDB;

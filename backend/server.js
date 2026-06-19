require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // REQUIRED for httpOnly cookies to be sent cross-origin
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for multipart form data pre-multer
app.use(cookieParser()); // parses cookies into req.cookies

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));

// ─── Health check ─────────────────────────────────────────────────────────────
// Render's free tier spins down after inactivity; this endpoint is useful
// for a frontend "ping" to wake it up before the first real request.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
// Express 5 (which you're using!) propagates async errors automatically,
// so you don't need try/catch in every route. But a global handler is still
// useful as a final safety net.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

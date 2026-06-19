const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);   // uses httpOnly cookie, no body needed
router.post("/logout", logout);

// Protected — requires valid access token
router.get("/me", protect, getMe);

module.exports = router;

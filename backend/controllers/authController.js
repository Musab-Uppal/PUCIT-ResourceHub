const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../config/jwt");

/*
 * Helper: set the refresh token as an httpOnly cookie.
 * Centralizing this so every auth response sets the cookie identically.
 * sameSite: 'strict' prevents the cookie from being sent in cross-site requests (CSRF protection).
 * secure: true in production so cookie only travels over HTTPS.
 */
const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check duplicate before creating — mongoose unique index also catches this,
    // but returning a clear message here is friendlier than a mongo duplicate key error.
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    // Note: password is hashed in the pre-save hook on the model, not here.

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      message: "Account created successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    // Mongoose validation errors have a specific shape
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // .select('+password') is a pattern for when the field is select:false in schema.
    // Our password field IS selectable, but being explicit here is good practice.
    const user = await User.findOne({ email });

    if (!user) {
      // Same message for wrong email AND wrong password — don't reveal which one failed.
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      // User signed up via Google — they have no password set.
      return res
        .status(401)
        .json({ message: "This account uses Google sign-in" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    res.json({
      message: "Logged in successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
// POST /api/auth/refresh
// Frontend calls this when the access token expires (gets a 401) to get a new one.
const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Refresh token invalid or expired" });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// Clears the refresh cookie. Frontend is responsible for deleting its stored access token.
const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// Used on app load to restore session from a stored access token.
const getMe = async (req, res) => {
  // req.user is already populated by the protect middleware
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
};

module.exports = { register, login, refresh, logout, getMe };

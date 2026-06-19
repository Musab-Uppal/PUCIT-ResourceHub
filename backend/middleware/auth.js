const { verifyAccessToken } = require("../config/jwt");
const User = require("../models/User");

/*
 * protect: verifies the JWT access token and attaches the user to req.user.
 * Usage: router.get('/profile', protect, controller)
 *
 * We fetch the user from DB (not just decode the token) because:
 * - Token payload only has the ID; we might need role, name, etc.
 * - If an account is deleted mid-session, a DB lookup catches that.
 *   (A pure-token approach would still pass the deleted user through.)
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/*
 * adminOnly: gates routes to admin users.
 * Always chain AFTER protect — protect must run first to set req.user.
 * Usage: router.patch('/approve/:id', protect, adminOnly, controller)
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminOnly };

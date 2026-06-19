const jwt = require("jsonwebtoken");

/*
 * Two-token strategy:
 * - Access token (15m): Short-lived, sent with every API request in the
 *   Authorization header. If stolen, expires quickly.
 * - Refresh token (7d): Longer-lived, stored in an httpOnly cookie. Used
 *   only to get a new access token. httpOnly means JS on the page can't
 *   read it — protects against XSS.
 *
 * For a portfolio project you could also go single-token (simpler), but the
 * two-token pattern is what you'd see in production and is worth knowing.
 */

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

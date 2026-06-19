const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/*
 * Why a single User model handles both auth methods:
 * - `googleId` is null for email/password users, populated for Google OAuth users.
 * - `password` is null for Google OAuth users (they never set one).
 * - This avoids a separate "OAuthUser" collection and keeps joins simple.
 *
 * Why `role` enum vs a separate Admin model:
 * - One admin exists (seeded), so a full "admin" collection is overkill.
 * - Adding the role field here lets middleware check req.user.role cleanly.
 *
 * Why we DON'T store the raw password:
 * - bcrypt hash is stored; the original is never persisted.
 * - The pre-save hook handles hashing automatically so callers never forget to hash.
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // always store lowercase so 'User@X.com' and 'user@x.com' don't dupe
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      // NOT required — Google OAuth users have no password
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String, // URL (Google profile pic or Cloudinary URL)
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

/*
 * Pre-save hook: only re-hash if the password field was actually changed.
 * Without `isModified` check, every .save() call (e.g., updating avatar)
 * would re-hash the already-hashed password — double-hashing breaks login.
 */
userSchema.pre("save", async function () {
  // Mongoose 9 supports async pre-hooks natively — no next() parameter needed.
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12); // 12 rounds: secure without being slow
});

// Instance method: compare candidate password against stored hash
userSchema.methods.matchPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

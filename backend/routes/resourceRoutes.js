const express = require("express");
const router = express.Router();
const {
  getMeta,
  uploadResource,
  getFeed,
  getMyUploads,
  getPending,
  approveResource,
  rejectResource,
  deleteResource,
  getSingleResource,
} = require("../controllers/resourceController");
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../config/multer");

// ── Public ──────────────────────────────────────────────────────────────────
router.get("/meta", getMeta);           // course + teacher lists for dropdowns
router.get("/", getFeed);               // approved public feed (filterable)

// ── Authenticated users ──────────────────────────────────────────────────────
router.get("/mine", protect, getMyUploads);

// upload.single('file') runs multer — it populates req.file if a file was sent.
// For 'link' type, no file is sent and req.file will simply be undefined (handled in controller).
router.post("/", protect, upload.single("file"), uploadResource);

// ── Admin only ───────────────────────────────────────────────────────────────
router.get("/pending", protect, adminOnly, getPending);
router.patch("/:id/approve", protect, adminOnly, approveResource);
router.patch("/:id/reject", protect, adminOnly, rejectResource);
router.delete("/:id", protect, adminOnly, deleteResource);

// ── Public Single Fetch (Must be last) ───────────────────────────────────────
router.get("/:id", getSingleResource);

module.exports = router;

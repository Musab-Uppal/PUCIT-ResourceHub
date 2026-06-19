const Resource = require("../models/Resource");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");
const { COURSES, TEACHERS, DEGREES, CAMPUSES } = require("../config/constants");

// ─── GET CONSTANTS ────────────────────────────────────────────────────────────
// GET /api/resources/meta
// Frontend calls this once on load to populate the course/teacher dropdowns.
// No auth needed — it's just static data.
const getMeta = (req, res) => {
  res.json({ courses: COURSES, teachers: TEACHERS, degrees: DEGREES, campuses: CAMPUSES });
};

// ─── UPLOAD RESOURCE ─────────────────────────────────────────────────────────
// POST /api/resources
// Handles all three types: pdf, image (file upload) and link (URL only).
const uploadResource = async (req, res) => {
  const { title, description, type, course, teacher, degree, campus, fileUrl: linkUrl } = req.body;

  try {
    // ── Link type: no file upload needed, just validate the URL ──
    if (type === "link") {
      if (!linkUrl) {
        return res.status(400).json({ message: "URL is required for link type" });
      }

      // Basic URL validation
      try {
        new URL(linkUrl);
      } catch {
        return res.status(400).json({ message: "Invalid URL format" });
      }

      const resource = await Resource.create({
        title,
        description,
        type: "link",
        fileUrl: linkUrl,
        course: course || null,
        teacher: teacher || null,
        degree: degree ? (Array.isArray(degree) ? degree : [degree]) : [],
        campus: campus || null,
        uploadedBy: req.user._id,
      });

      return res.status(201).json({
        message: "Resource submitted for review",
        resource,
      });
    }

    // ── PDF / Image type: must have a file ──
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Determine Cloudinary resource_type:
    // PDFs must use 'raw' — 'auto' or 'image' will reject them.
    const isImage = req.file.mimetype.startsWith("image/");
    const cloudinaryResourceType = isImage ? "image" : "raw";
    const folder = isImage ? "pucit-hub/images" : "pucit-hub/pdfs";

    const { url, publicId } = await uploadToCloudinary(
      req.file.buffer,
      folder,
      cloudinaryResourceType
    );

    const resource = await Resource.create({
      title,
      description,
      type: isImage ? "image" : "pdf",
      fileUrl: url,
      cloudinaryId: publicId,
      course: course || null,
      teacher: teacher || null,
      degree: degree ? (Array.isArray(degree) ? degree : [degree]) : [],
      campus: campus || null,
      uploadedBy: req.user._id,
    });

    return res.status(201).json({
      message: "Resource submitted for review",
      resource,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed. Please try again." });
  }
};

// ─── GET PUBLIC FEED ──────────────────────────────────────────────────────────
// GET /api/resources?course=X&teacher=Y&type=Z&page=1
// Returns approved resources in random-ish order (sorted by createdAt DESC with optional filters).
const getFeed = async (req, res) => {
  const { course, teacher, type, degree, campus, page = 1 } = req.query;
  const limit = 12;
  const skip = (page - 1) * limit;

  const filter = { status: "approved" };
  if (course) filter.course = course;
  if (teacher) filter.teacher = teacher;
  if (type) filter.type = type;
  if (degree) filter.degree = degree;
  if (campus) filter.campus = campus;

  try {
    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("uploadedBy", "name avatar"), // show uploader's name on card
      Resource.countDocuments(filter),
    ]);

    res.json({
      resources,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ message: "Could not load resources" });
  }
};

// ─── GET MY UPLOADS ───────────────────────────────────────────────────────────
// GET /api/resources/mine  (protected)
const getMyUploads = async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ message: "Could not load your uploads" });
  }
};

// ─── ADMIN: GET ALL PENDING ───────────────────────────────────────────────────
// GET /api/resources/pending  (admin only)
const getPending = async (req, res) => {
  try {
    const resources = await Resource.find({ status: "pending" })
      .sort({ createdAt: 1 }) // oldest first — FIFO moderation queue
      .populate("uploadedBy", "name email");
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ message: "Could not load pending resources" });
  }
};

// ─── ADMIN: APPROVE ───────────────────────────────────────────────────────────
// PATCH /api/resources/:id/approve  (admin only)
const approveResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status: "approved", rejectionReason: null },
      { new: true }
    );
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource approved", resource });
  } catch (err) {
    res.status(500).json({ message: "Could not approve resource" });
  }
};

// ─── ADMIN: REJECT ────────────────────────────────────────────────────────────
// PATCH /api/resources/:id/reject  (admin only)
// Deletes the file from Cloudinary to avoid wasting storage quota.
const rejectResource = async (req, res) => {
  const { reason } = req.body;

  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    // Delete from Cloudinary (no-op for link types since there's no file)
    if (resource.cloudinaryId) {
      const cType = resource.type === "image" ? "image" : "raw";
      await deleteFromCloudinary(resource.cloudinaryId, cType);
    }

    resource.status = "rejected";
    resource.rejectionReason = reason || null;
    await resource.save();

    res.json({ message: "Resource rejected", resource });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Could not reject resource" });
  }
};

// ─── ADMIN: DELETE ────────────────────────────────────────────────────────────
// DELETE /api/resources/:id  (admin only)
// Permanently removes the resource and deletes the file from Cloudinary.
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    // Delete from Cloudinary (no-op for link types since there's no file)
    if (resource.cloudinaryId) {
      const cType = resource.type === "image" ? "image" : "raw";
      await deleteFromCloudinary(resource.cloudinaryId, cType);
    }

    await resource.deleteOne();

    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Could not delete resource" });
  }
};

module.exports = {
  getMeta,
  uploadResource,
  getFeed,
  getMyUploads,
  getPending,
  approveResource,
  rejectResource,
  deleteResource,
};

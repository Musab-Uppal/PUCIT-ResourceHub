const multer = require("multer");

/*
 * memoryStorage: files land in req.file.buffer, never touch disk.
 * This is the correct approach for streaming to Cloudinary on Render.
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB — Cloudinary free tier limit is 10MB for images, 100MB for raw
  },
});

module.exports = upload;

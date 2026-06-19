const cloudinary = require("cloudinary").v2;

/*
 * Configure once — imported by any file that needs to upload.
 * Cloudinary v2 uses named exports, so we destructure .v2 here.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
 * uploadToCloudinary: takes a file buffer (from multer memoryStorage) and
 * streams it directly to Cloudinary without writing to disk.
 *
 * Why streaming instead of writing a temp file?
 * - Render's free tier has an ephemeral filesystem — anything written to disk
 *   disappears between requests. Streaming avoids the disk entirely.
 * - Lower memory footprint: we pipe the buffer straight through.
 *
 * @param {Buffer} buffer      - File buffer from req.file.buffer
 * @param {string} folder      - Cloudinary folder (e.g. 'resources/pdfs')
 * @param {string} resourceType - 'raw' for PDFs, 'image' for images
 * @returns {Promise<{url, publicId}>}
 */
const uploadToCloudinary = (buffer, folder, resourceType = "raw") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // 'raw' is required for PDFs — Cloudinary won't process them as images
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};

/*
 * deleteFromCloudinary: removes a file from Cloudinary by its public_id.
 * Called when an admin rejects a resource — no point keeping the file.
 *
 * @param {string} publicId
 * @param {string} resourceType - 'raw' for PDFs, 'image' for images
 */
const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };

const mongoose = require("mongoose");
const { COURSES, TEACHERS, DEGREES, CAMPUSES } = require("../config/constants");

/*
 * Schema decisions:
 *
 * 1. course + teacher are strings validated against the constants arrays,
 *    NOT ObjectId references. This keeps the schema flat and queries simple.
 *    The tradeoff: if you rename a course, existing resources still have the
 *    old string. At this scale that's acceptable — just don't rename.
 *
 * 2. "At least one of course or teacher" is enforced by a custom schema-level
 *    validator (see bottom). Mongoose field-level validators run per field;
 *    cross-field rules need a path validator on the doc.
 *
 * 3. fileUrl is the Cloudinary secure_url for pdf/image types, and the raw
 *    URL string for links. No separate field needed — the `type` field tells
 *    you how to render it.
 *
 * 4. status starts as 'pending' by default — resources are NEVER public until
 *    an admin explicitly approves them.
 */

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
//optional
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    type: {
      type: String,
      enum: {
        values: ["pdf", "link", "image"],
        message: "Type must be pdf, link, or image",
      },
      required: [true, "Resource type is required"],
    },

    // Cloudinary URL for pdf/image; raw URL for link type
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },

    // Optional: Cloudinary public_id — needed if you ever want to delete the file from Cloudinary
    cloudinaryId: {
      type: String,
      default: null,
    },

    // Original filename from the uploader's machine (e.g. "DSA_Notes.pdf")
    // Used to build a proper fl_attachment Cloudinary download URL with the correct name + extension.
    originalFileName: {
      type: String,
      default: null,
    },

    // Validated against the COURSES constant array
    course: {
      type: String,
      enum: {
        values: [...COURSES],
        message: '"{VALUE}" is not a recognized course',
      },
      default: null,
    },

    // Validated against the TEACHERS constant array
    teacher: {
      type: String,
      enum: {
        values: [...TEACHERS],
        message: '"{VALUE}" is not a recognized teacher',
      },
      default: null,
    },

    /*
     * Degree tag — which program(s) this resource is relevant to.
     * Stored as an array so a resource shared across CS and SE
     * (e.g. a common elective) doesn't need to be uploaded twice.
     * Optional — a resource without a degree tag is visible to all.
     */
    degree: {
      type: [String],
      enum: {
        values: [...DEGREES],
        message: '"{VALUE}" is not a valid degree. Must be one of: CS, SE, IT, DS',
      },
      default: [],
    },

    // NC = New Campus, OC = Old Campus. Single value — a resource belongs to one campus.
    campus: {
      type: String,
      enum: {
        values: [...CAMPUSES],
        message: '"{VALUE}" is not a valid campus. Must be NC or OC',
      },
      default: null,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Set by admin when rejecting — shown to the uploader in the future
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Cross-field validation: at least one of course or teacher must be provided.
 * This runs at the document level so it can see both fields at once.
 * schema.pre('validate') fires before field-level validators, so errors
 * from both this and field validators surface together.
 */
resourceSchema.pre("validate", function () {
  if (!this.course && !this.teacher) {
    this.invalidate(
      "course",
      "At least one of course or teacher must be selected"
    );
  }
});

/*
 * Index strategy:
 * - status + createdAt: the home feed query filters by status:'approved' and
 *   sorts by createdAt DESC — this compound index makes that fast.
 * - uploadedBy: for "my uploads" page queries.
 */
resourceSchema.index({ status: 1, createdAt: -1 });
resourceSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model("Resource", resourceSchema);

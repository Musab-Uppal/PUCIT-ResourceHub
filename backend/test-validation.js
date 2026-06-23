const mongoose = require("mongoose");
const Resource = require("./models/Resource");

const test = new Resource({
  title: "Test",
  description: "Test",
  type: "link",
  fileUrl: "https://test.com",
  campus: null,
  course: null,
  teacher: null,
  degree: []
});

const err = test.validateSync();
console.log("Validation Error:", err ? err.message : "Success");

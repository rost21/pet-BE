const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const StudentSchema = mongoose.Schema({
  // id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: { type: String, required: true },
  group: { type: String, required: true },
  speciality: { type: String },
});

StudentSchema.plugin(uniqueValidator, {
  message: "Error, student with this {PATH} already exists"
});

module.exports = mongoose.model("Student", StudentSchema);

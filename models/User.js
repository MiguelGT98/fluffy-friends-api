var mongoose = require("mongoose");

// Define your schema as normal.
var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, index: true, unique: true, required: true },
  password: { type: String, required: true },
  names: { type: String, default: "" },
  lastNames: { type: String, default: "" },
  phone: { type: String, default: "" },
  avatar: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);

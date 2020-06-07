var mongoose = require("mongoose");

// Define your schema as normal.
var friendSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Friend", friendSchema);

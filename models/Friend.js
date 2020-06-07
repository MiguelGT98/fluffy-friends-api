var mongoose = require("mongoose");

// Define your schema as normal.
var friendSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  breed: { type: String, required: true },
  characteristics: { type: Array, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  owner: { type: String, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model("Friend", friendSchema);

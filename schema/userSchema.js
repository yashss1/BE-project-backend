const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  publicKey: {
    required: true,
    type: String,
    unique: true,
  },
  privateKey: {
    required: true,
    type: String,
    unique: true,
  }
});

module.exports = mongoose.model("user", userSchema);

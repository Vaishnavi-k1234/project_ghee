const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // You can add other fields as needed
});

const User = mongoose.model("User", userSchema);

module.exports = User;

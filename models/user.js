const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: String,
  userrole: String
});

module.exports = mongoose.model("users", userSchema);

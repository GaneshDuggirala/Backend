var mongoose = require("mongoose");

var userprofileSchema = mongoose.Schema({
  username: String,
  investedplans: [],
});

module.exports = mongoose.model("userprofiles", userprofileSchema);

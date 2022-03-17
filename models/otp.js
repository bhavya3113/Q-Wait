const mongoose = require("mongoose");
const schema = mongoose.Schema;

const otpSchema = new schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, expires: "2m", default: Date.now },
});

module.exports = mongoose.model("otp",otpSchema);
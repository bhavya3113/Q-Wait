const mongoose = require("mongoose");
const schema = mongoose.Schema;

const tokenSchema = new schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  
  createdAt: { type: Date, expires: "30d", default: Date.now },
});

module.exports = mongoose.model("token",tokenSchema);
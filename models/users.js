const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  fullname:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require:true
  },
  mobileno:{
    type: Number,
    require:true
  },
  gender: String,
  image: String,
  isStore:{
    type: Boolean,
    require: true,
    default:false
  },
  passVerify:{
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("users",userSchema);
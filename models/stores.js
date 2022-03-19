const mongoose = require("mongoose");
const schema = mongoose.Schema;

const storeSchema = new schema({
 
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
  category: String,
  
  verified:{
    type: Boolean,
    require: true,
    default:false
  },

})

module.exports = mongoose.model("stores",storeSchema);
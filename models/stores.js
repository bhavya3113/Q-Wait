const mongoose = require("mongoose");
const schema = mongoose.Schema;

const storeSchema = new schema({
 
  details:{
    type: schema.Types.ObjectId,
    require:true,
    ref:'users',
  },
  verified:{
    type: Boolean,
    require: true,
    default:false
  },

})

module.exports = mongoose.model("stores",storeSchema);
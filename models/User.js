const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  Date : {
    type : Date,
    default : Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);

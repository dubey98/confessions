const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Schema definition
const userSchema = new Schema({
  first_name: { type: String, required: true },
  family_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  isMember: { type: Boolean, required: true, default: false },
});

userSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

userSchema.virtual("fullname").get(function () {
  return this.family_name + "," + this.first_name;
});

//export the model
module.exports = mongoose.model("User", userSchema);

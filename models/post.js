const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  date_created: { type: Date, default: Date.now },
});

postSchema.virtual("date_formatted").get(function () {
  return moment(this.date_created).fromNow();
});

postSchema.virtual("url").get(function () {
  return "/post/" + this._id;
});

module.exports = mongoose.model("Post", postSchema);

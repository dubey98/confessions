const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  author: { type: Schema.Types.ObjectId },
  date_created: { type: Date, default: Date.now },
});

postSchema.virtual("url").get(function () {
  return "/post/" + this._id;
});

module.exports = mongoose.model("Post", postSchema);

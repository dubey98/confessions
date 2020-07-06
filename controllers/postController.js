const Post = require("../models/post");
const User = require("../models/user");

exports.index = function (req, res, next) {
  res.render("index");
};

exports.post_detail = function (req, res) {
  res.send("post detail for : " + req.params.id);
};

exports.post_create_get = function (req, res) {
  res.send("post create get req");
};

exports.post_create_post = function (req, res) {
  res.send("post create post req");
};

exports.post_delete_get = (req, res) => {
  res.send("post delete get ");
};

exports.post_delete_post = (req, res) => {
  res.send("post delete post ");
};

exports.post_update_get = (req, res) => {
  res.send("post post  get");
};

exports.post_update_post = (req, res) => {
  res.send("post update post ");
};

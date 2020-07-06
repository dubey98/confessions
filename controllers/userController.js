const User = require("../models/user");
const Posts = require("../models/post");

exports.user_detail = function (req, res, next) {
  res.send("user detail page not implemented");
};

exports.user_login_get = function (req, res, next) {
  res.send("user login page ");
};

exports.user_login_post = function (req, res) {
  res.send("user login post ");
};

exports.user_logout = function (req, res) {
  res.send("user logged out ");
};

exports.user_signup_get = function (req, res, next) {
  res.send("user sign up page ");
};

exports.user_signup_post = function (req, res) {
  res.send("user sign up post ");
};

exports.user_delete_get = function (req, res) {
  res.send("delete user page");
};

exports.user_delete_post = function (req, res) {
  res.send("delete user post");
};

exports.user_update_get = function (req, res) {
  res.send("update user page");
};

exports.user_update_post = function (req, res) {
  res.send("update user post");
};

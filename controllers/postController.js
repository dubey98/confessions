const validator = require("express-validator");
const async = require("async");

const Post = require("../models/post");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { locals } = require("../app");

exports.index = function (req, res, next) {
  if (req.user) console.log("user is logged in");
  else console.log("user is not logged in ");
  res.render("index", { title: "Home page", user: req.user });
};

exports.post_detail = function (req, res) {
  async.series(
    {
      post: function (callback) {
        Post.findById(req.params.id).populate("author").exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.post == null) {
        let error = new Error("Post not found");
        error.status = 404;
        return next(error);
      }
      if (req.user) console.log("user is logged in");
      res.render("post_detail", {
        post: results.post,
        user: req.user,
      });
    }
  );
};

exports.post_create_get = function (req, res) {
  if (req.user)
    res.render("post_create", { title: "Create post", user: req.user });
  else {
    res.render("login", { title: "Log In" });
  }
};

exports.post_create_post = [
  validator
    .body("title", "your post should have a title")
    .trim()
    .isLength({ min: 1 }),
  validator
    .body("message", "post message not provided.")
    .trim()
    .isLength({ min: 1 }),

  //sanitize body with a wildcard
  validator.sanitizeBody("*").escape(),

  //create post
  (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      author: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.render("post_create", {
        title: "Create post",
        post: post,
        errors: errors.array(),
      });
    } else {
      post.save(function (err) {
        if (err) return next(err);
        res.redirect(post.url);
      });
    }
  },
];

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

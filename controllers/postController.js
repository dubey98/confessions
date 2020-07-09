const validator = require("express-validator");
const async = require("async");

const Post = require("../models/post");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { locals } = require("../app");

exports.index = function (req, res, next) {
  // console.log(req.user);
  Post.find({})
    .populate("author")
    .exec(function (err, results) {
      if (err) return next(err);
      res.render("index", {
        title: "Home page",
        posts: results,
        user: req.user,
      });
    });
};

exports.post_detail = function (req, res) {
  if (req.user) {
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
        res.render("post_detail", {
          title: results.post.title,
          post: results.post,
          user: req.user,
        });
      }
    );
  } else {
    res.render("access_denied", {
      title: "View a post detail",
      message: "please re login",
    });
  }
};

exports.post_create_get = function (req, res) {
  if (req.user)
    res.render("post_create", { title: "Create post", user: req.user });
  else {
    res.render("login", { title: "Log In" });
  }
};

exports.post_create_post = [
  (req, res, next) => {
    if (req.user) next();
    else res.redirect("/users/login");
  },

  validator
    .body("title", "your post should have a title")
    .trim()
    .isLength({ min: 1 }),
  validator
    .body("message", "post message not provided.")
    .trim()
    .isLength({ min: 1 }),

  //sanitize body with a wildcard
  // validator.sanitizeBody("*").escape(),

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
  if (req.user && req.user.isAdmin) {
    res.render("delete_post", {
      title: "Delete post",
      user: req.user,
      id: req.params.id,
    });
  } else {
    res.render("access_denied", {
      title: "Delete post",
      message: "You do not have permission to delete this post",
      user: req.user,
    });
  }
};

exports.post_delete_post = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    Post.findByIdAndRemove(req.params.id, function deletePost(err) {
      if (err) return next(err);
      res.redirect("/");
    });
  } else {
    res.render("access_denied", {
      title: "Delete post",
      message: "You do not have permission to delete this post",
      user: req.user,
    });
  }
};

exports.post_update_get = (req, res) => {
  if (req.user)
    async.parallel(
      {
        post: function (callback) {
          Post.findById(req.params.id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.post == null) {
          const error = new Error("Post not found.");
          error.status = 404;
          return next(error);
        }
        res.render("post_create", {
          title: "Update post",
          post: results.post,
          user: req.user,
        });
      }
    );
  else {
    res.render("login", { title: "Log In" });
  }
};

exports.post_update_post = [
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
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("post_create", {
        title: "Update post",
        post: post,
        errors: errors.array(),
      });
    } else {
      Post.findByIdAndUpdate(req.params.id, post, {}, function (err) {
        if (err) return next(err);
        res.redirect(post.url);
      });
    }
  },
];

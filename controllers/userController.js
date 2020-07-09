const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const async = require("async");
require("dotenv").config();

const User = require("../models/user");
const Posts = require("../models/post");

exports.user_detail = function (req, res, next) {
  if (req.user) {
    async.parallel(
      {
        user: function (callback) {
          User.findById(req.params.id).exec(callback);
        },
        posts: function (callback) {
          Posts.find({ author: req.params.id }).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.user == null) {
          const error = new Error("User not found");
          error.status = 404;
          return next(error);
        }
        res.render("user_detail", { user: results.user, posts: results.posts });
      }
    );
  } else {
    res.redirect("/users/login");
  }
};

exports.user_login_get = function (req, res, next) {
  res.render("login", { title: "LOG IN" });
};

// exports.user_login_post = function (req, res, next) {};

exports.user_logout = function (req, res) {
  req.logout();
  res.redirect("/");
};

exports.user_signup_get = function (req, res, next) {
  res.render("signup", { title: "Sign Up" });
};

exports.user_signup_post = [
  // Validate fields
  validator
    .body("first_name", "first name is required")
    .trim()
    .isLength({ min: 1 }),
  validator
    .body("family_name", "family name is required")
    .trim()
    .isLength({ min: 1 }),
  validator
    .body("password", "password is required")
    .trim()
    .isLength({ min: 1 }),
  validator.check("password").exists(),
  validator
    .check(
      "passwordConfirmation",
      "Confirm password field should have the same password "
    )
    .exists()
    .custom((value, { req }) => value === req.body.password),

  // Sanitize fields
  validator.sanitizeBody("*").escape(),

  // Process request
  (req, res, next) => {
    //extract the validation errors
    const errors = validator.validationResult(req);

    console.log("CP 1 ");

    // Create the Hashed password using bcrypt
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      const user = new User({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        username: req.body.username,
        password: hashedPassword,
      });
      if (req.body.memberPassword === process.env.MEMBERPASSWORD)
        user.isMember = true;
      if (req.body.adminPassword === process.env.ADMINPASSWORD)
        user.isAdmin = true;
      async.parallel(
        {
          user: function (callback) {
            User.findOne({ username: req.body.username }).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          if (results.user == null) {
            if (!errors.isEmpty()) {
              res.render("signup", {
                title: "Sign Up",
                user: user,
                errors: errors.array(),
              });
            } else {
              user.save(function (err) {
                if (err) return next(err);
                req.login(user, function (err) {
                  if (err) return next(err);
                  else res.redirect("/");
                });
              });
            }
          } else {
            res.render("signup", {
              title: "Sign Up",
              user: user,
              message: "Sorry, that username is already taken",
              errors: errors.array(),
            });
          }
        }
      );
    });
  },
];

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

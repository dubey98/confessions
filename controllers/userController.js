const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/user");
const Posts = require("../models/post");

exports.user_detail = function (req, res, next) {
  res.send("user detail page not implemented");
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
        isAdmin: false,
        isMember: false,
      });

      console.log("CP 2 ");
      if (!errors.isEmpty()) {
        res.render("signup", {
          title: "Sign Up",
          user: user,
          errors: errors.array(),
        });
        console.log("CP 3");
      } else {
        user.save(function (err) {
          if (err) return next(err);
          req.login(user, function (err) {
            if (err) return next(err);
            else res.render("index", { user: req.user });
          });
        });
      }
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

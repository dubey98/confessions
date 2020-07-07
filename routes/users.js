const express = require("express");
let router = express.Router();
const passport = require("passport");
const user_controller = require("../controllers/userController");

router.get("/signup", user_controller.user_signup_get);

router.post("/signup", user_controller.user_signup_post);

router.get("/login", user_controller.user_login_get);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/:id/delete", user_controller.user_delete_get);

router.post("/:id/delete", user_controller.user_delete_post);

router.get("/:id/update", user_controller.user_update_get);

router.post("/:id/update", user_controller.user_update_post);

router.get("/logout", user_controller.user_logout);

router.get("/:id", user_controller.user_detail);

module.exports = router;

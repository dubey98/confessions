const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/postController");

//get the Home page of website
router.get("/", post_controller.index);

router.get("/post/create", post_controller.post_create_get);

router.post("/post/create", post_controller.post_create_post);

router.get("/post/:id/delete", post_controller.post_delete_get);

router.post("/post/:id/delete", post_controller.post_delete_post);

router.get("/post/:id/update", post_controller.post_update_get);

router.post("/post/:id/update", post_controller.post_update_post);

router.get("/post/:id", post_controller.post_detail);

module.exports = router;

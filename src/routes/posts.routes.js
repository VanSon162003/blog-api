const express = require("express");
const router = express.Router();
const postsController = require("../controller/posts.controller");

router.get("/", postsController.getList);
router.get("/slug/:slug", postsController.getBySlug);
router.get("/id/:id", postsController.getOne);
router.get("/count/:topicId", postsController.countAllPostsInTopic);
router.get("/topic/:topicId", postsController.getAllCommentsInPost);
router.post("/", postsController.create);
router.put("/:id", postsController.update);
router.delete("/:id", postsController.remove);

module.exports = router;

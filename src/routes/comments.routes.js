const express = require("express");
const router = express.Router();
const commentsController = require("../controller/comments.controller");

router.get("/", commentsController.getList);
router.get("/slug/:slug", commentsController.getBySlug);
router.get("/id/:id", commentsController.getOne);
router.get("/post/:postId", commentsController.getAllCommentsInPost);
router.post("/", commentsController.create);
router.put("/:id", commentsController.update);
router.delete("/:id", commentsController.remove);

module.exports = router;

const express = require("express");
const router = express.Router();
const commentsController = require("../controller/comments.controller");
const checkAuth = require("../middlewares/checkAuth");

router.get("/", commentsController.getList);
router.get("/slug/:slug", commentsController.getBySlug);
router.get("/id/:id", commentsController.getOne);
router.get("/post/:postId", checkAuth, commentsController.getAllCommentsInPost);
router.post("/", checkAuth, commentsController.create);
router.post("/:commentId/like", checkAuth, commentsController.toggleLike);
router.put("/:id", checkAuth, commentsController.update);
router.delete("/:id", commentsController.remove);

module.exports = router;

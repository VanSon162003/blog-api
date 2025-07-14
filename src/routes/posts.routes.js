const express = require("express");
const router = express.Router();
const postsController = require("../controller/posts.controller");
const checkAuth = require("../middlewares/checkAuth");

router.get("/", checkAuth, postsController.getList);
router.get("/topic/:topicId", checkAuth, postsController.getListByTopicId);
router.get("/user/bookmarks", checkAuth, postsController.getListByUserId);
router.post("/", postsController.create);
router.post("/:postId/like", checkAuth, postsController.toggleLike);
router.put("/:id", postsController.update);
router.delete("/:id", postsController.remove);

module.exports = router;

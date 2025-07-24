const express = require("express");
const router = express.Router();
const postsController = require("../controller/posts.controller");
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");

router.get("/", checkAuth, postsController.getList);
router.get("/me", checkAuth, postsController.getListByMe);
router.get("/slug/:slug", checkAuth, postsController.getBySlug);
router.get("/topic/:topicId", checkAuth, postsController.getListByTopicId);
router.get("/user/bookmarks", checkAuth, postsController.getListByUserId);
router.get("/:postId/related", checkAuth, postsController.getRelatedPosts);
router.get("/user/:username", checkAuth, postsController.getByUserName);

router.post("/", upload.single("thumbnail"), checkAuth, postsController.create);
router.post("/:postId/like", checkAuth, postsController.toggleLike);
router.put("/:id", postsController.update);

router.delete("/:id", postsController.remove);

module.exports = router;

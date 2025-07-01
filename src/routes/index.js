const express = require("express");
const router = express.Router();
const postsRouter = require("./posts.routes");
const topicsRouter = require("./topics.routes");
const commentsRouter = require("./comments.routes");

router.use("/posts", postsRouter);
router.use("/topics", topicsRouter);
router.use("/comments", commentsRouter);

module.exports = router;

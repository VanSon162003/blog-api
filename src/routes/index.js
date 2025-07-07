const express = require("express");
const router = express.Router();
const postsRouter = require("./posts.routes");
const topicsRouter = require("./topics.routes");
const commentsRouter = require("./comments.routes");
const authRouter = require("./auth.route");

router.use("/posts", postsRouter);
router.use("/topics", topicsRouter);
router.use("/comments", commentsRouter);
router.use("/auth", authRouter);

module.exports = router;

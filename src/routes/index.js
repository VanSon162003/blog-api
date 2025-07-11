const express = require("express");
const router = express.Router();
const postsRouter = require("./posts.routes");
const topicsRouter = require("./topics.routes");
const commentsRouter = require("./comments.routes");
const authRouter = require("./auth.route");
const pusherRouter = require("./pusher.route");
const conversationRouter = require("./conversations.route");
const messagesRouter = require("./messages.route");

router.use("/messages", messagesRouter);
router.use("/conversation", conversationRouter);
router.use("/pusher", pusherRouter);
router.use("/posts", postsRouter);
router.use("/topics", topicsRouter);
router.use("/comments", commentsRouter);
router.use("/auth", authRouter);

module.exports = router;

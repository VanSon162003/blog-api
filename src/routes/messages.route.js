const express = require("express");
const router = express.Router();
const messagesController = require("../controller/messages.controller");
const checkAuth = require("../middlewares/checkAuth");

router.get("/conversation/:id", messagesController.getByConversationId);
router.post("/", checkAuth, messagesController.create);

module.exports = router;

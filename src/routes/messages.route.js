const express = require("express");
const router = express.Router();
const messagesController = require("../controller/messages.controller");

router.get("/conversation/:id", messagesController.getByConversationId);

module.exports = router;

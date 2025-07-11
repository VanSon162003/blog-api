const express = require("express");
const router = express.Router();
const conversationController = require("../controller/conversation.controller");

router.get("/name/:name", conversationController.getOneByName);

module.exports = router;

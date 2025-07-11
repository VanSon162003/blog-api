const express = require("express");
const router = express.Router();
const pusherController = require("../controller/pusher.controller");

router.post("/send-message", pusherController.sendMessage);

module.exports = router;

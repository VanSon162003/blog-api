const express = require("express");
const router = express.Router();
const conversationController = require("../controller/conversation.controller");
const checkAuth = require("../middlewares/checkAuth");

router.get("/", checkAuth, conversationController.getAll);
router.get("/:id", checkAuth, conversationController.getOne);
router.get("/name/:name", conversationController.getOneByName);
router.post("/", conversationController.create);

module.exports = router;

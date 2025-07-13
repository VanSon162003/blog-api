const express = require("express");
const router = express.Router();
const likesController = require("../controller/likes.controller");

router.post("/", likesController.create);
router.put("/:userId", likesController.update);

module.exports = router;

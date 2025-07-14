const express = require("express");
const router = express.Router();
const bookmarksController = require("../controller/bookmarks.controller");
const checkAuth = require("../middlewares/checkAuth");

router.post("/:postId", checkAuth, bookmarksController.create);

module.exports = router;

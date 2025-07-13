const express = require("express");
const router = express.Router();
const postsController = require("../controller/posts.controller");

router.get("/", postsController.getList);
router.post("/", postsController.create);
router.put("/:id", postsController.update);
router.delete("/:id", postsController.remove);

module.exports = router;

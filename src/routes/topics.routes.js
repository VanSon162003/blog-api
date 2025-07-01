const express = require("express");
const router = express.Router();
const topicsController = require("../controller/topics.controller");

router.get("/", topicsController.getList);
router.get("/slug/:slug", topicsController.getBySlug);
router.get("/id/:id", topicsController.getOne);
router.post("/", topicsController.create);
router.put("/:id", topicsController.update);
router.delete("/:id", topicsController.remove);

module.exports = router;

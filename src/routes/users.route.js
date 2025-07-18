const express = require("express");
const router = express.Router();
const usersController = require("../controller/users.controller");
const checkAuth = require("../middlewares/checkAuth");

router.post("/follow/:userId", checkAuth, usersController.toggleFollow);
router.get("/follow/:userId", checkAuth, usersController.checkFollowing);

module.exports = router;

const express = require("express");
const authController = require("../controller/auth.controller");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.get("/me", checkAuth, authController.me);

router.post("/register", authController.register);
router.post("/refresh", authController.refreshToken);
router.post("/login", authController.login);

module.exports = router;

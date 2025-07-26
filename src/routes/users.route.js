const express = require("express");
const router = express.Router();
const usersController = require("../controller/users.controller");
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");

router.get("/follow/:userId", checkAuth, usersController.checkFollowing);
router.get("/:username", checkAuth, usersController.getUserByUsername);
router.post("/follow/:userId", checkAuth, usersController.toggleFollow);
router.put(
    "/edit-profile",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "cover_image", maxCount: 1 },
    ]),
    checkAuth,
    usersController.editProfile
);
router.post("/settings", checkAuth, usersController.settings);

module.exports = router;

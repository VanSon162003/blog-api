const pusher = require("../config/pusher");
const userService = require("../service/users.service");
const response = require("../utils/response");

exports.getUserByUsername = async (req, res) => {
    try {
        const result = await userService.getUserByUsername(req.params.username);
        response.success(res, 200, result);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.toggleFollow = async (req, res) => {
    try {
        const result = await userService.toggleFollow(
            req.user,
            +req.params.userId
        );
        response.success(res, 200, result);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.checkFollowing = async (req, res) => {
    try {
        const result = await userService.checkFollowing(
            req.user,
            +req.params.userId
        );
        response.success(res, 200, result);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.editProfile = async (req, res) => {
    try {
        const result = await userService.editProfile(
            req.files,
            req.body,
            req.user
        );
        response.success(res, 200, result);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

// const files = req.files;

//     const avatarPath = files.avatar?.[0].path;
//     const coverImagePath = files.coverImage?.[0].path;

//     console.log("test nhé", 123, avatarPath, coverImagePath);

//     const { ...data } = req.body;
//     console.log(data);

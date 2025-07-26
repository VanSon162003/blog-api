const pusher = require("../config/pusher");
const userService = require("../service/users.service");
const response = require("../utils/response");

exports.getUserByUsername = async (req, res) => {
    try {
        const result = await userService.getUserByUsername(
            req.params.username,
            req.user
        );
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

exports.settings = async (req, res) => {
    try {
        await userService.settings(req.body, req.user);
        response.success(res, 201, true);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

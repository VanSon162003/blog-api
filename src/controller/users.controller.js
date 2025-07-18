const pusher = require("../config/pusher");
const userService = require("../service/users.service");
const response = require("../utils/response");

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

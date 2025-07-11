const authService = require("../service/auth.service");
const response = require("../utils/response");

const { Queue } = require("../db/models");

const register = async (req, res) => {
    try {
        const { userId, token } = await authService.register(req.body);

        await Queue.create({
            type: "sendVerifyEmailJob",
            payload: { userId },
        });
        response.success(res, 200, token);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

const login = async (req, res) => {
    try {
        const tokenData = await authService.login(
            req.body.email,
            req.body.password
        );
        response.success(res, 200, tokenData);
    } catch (error) {
        response.error(res, 401, error.message);
    }
};

const me = async (req, res) => {
    response.success(res, 200, req.user);
};

const refreshToken = async (req, res) => {
    try {
        const tokenData = await authService.refreshAccessToken(
            req.body.refresh_token
        );
        response.success(res, 200, tokenData);
    } catch (error) {
        response.error(res, 403, error.message);
    }
};

module.exports = { register, login, me, refreshToken };

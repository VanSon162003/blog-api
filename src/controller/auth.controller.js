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
        response.error(res, 402, error.message);
    }
};

const me = async (req, res) => {
    if (!req.user) {
        return response.error(res, 401, "Token invalid");
    }

    return response.success(res, 200, req.user);
};

const refreshToken = async (req, res) => {
    console.log("token: +", req.body.refresh_token);

    try {
        const tokenData = await authService.refreshAccessToken(
            req.body.refresh_token
        );
        response.success(res, 200, tokenData);
    } catch (error) {
        response.error(res, 403, error.message);
    }
};

const forgotPassword = async (req, res) => {
    try {
        await authService.forgotPassword(req.body.email);

        res.status(201).send("");
    } catch (error) {
        throw new Error("Email không tồn tại");
    }
};

const resetPassword = async (req, res) => {
    try {
        await authService.resetPassword(req.body);
        res.status(200).send("");
    } catch (error) {
        throw new Error(error);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const check = await authService.verifyEmail(req.query.token);

        if (check === "verified") {
            return res.json({
                status: true,
            });
        }

        res.status(201).send("");
    } catch (error) {
        throw new Error("Token không tồn tại");
    }
};

const verifyToken = async (req, res) => {
    try {
        const verify = await authService.verifyToken(req.query.token);

        res.status(201).json({
            data: verify,
        });
    } catch (error) {
        throw new Error("Token không hợp lệ");
    }
};

module.exports = {
    register,
    login,
    me,
    refreshToken,
    forgotPassword,
    verifyEmail,
    verifyToken,
    resetPassword,
};

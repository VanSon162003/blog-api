const { User } = require("../db/models");
const { hash, compare } = require("../utils/bcrypt");
const jwtService = require("./jwt.service");
const refreshTokenService = require("./refreshToken.service");

const register = async (data) => {
    const user = await User.create({
        ...data,
        password: await hash(data.password),
        first_name: data.first_name,
        last_name: data.last_name,
    });

    const userId = user.id;
    const token = jwtService.generateAccessToken(userId);

    return {
        userId,
        token,
    };
};

const login = async (email, password) => {
    const user = await User.findOne({ where: { email }, raw: true });
    if (!user) {
        throw new Error("Thông tin đăng nhập không hợp lệ.");
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
        throw new Error("Thông tin đăng nhập không hợp lệ.");
    }

    const tokenData = jwtService.generateAccessToken(user.id);
    const refreshToken = await refreshTokenService.createRefreshToken(user.id);

    return {
        ...tokenData,
        refresh_token: refreshToken.token,
    };
};

const refreshAccessToken = async (refreshTokenString) => {
    const refreshToken = await refreshTokenService.findValidRefreshToken(
        refreshTokenString
    );
    if (!refreshToken) {
        throw new Error("Refresh token không hợp lệ");
    }

    const tokenData = jwtService.generateAccessToken(refreshToken.user_id);
    await refreshTokenService.deleteRefreshToken(refreshToken);

    const newRefreshToken = await refreshTokenService.createRefreshToken(
        refreshToken.user_id
    );

    return {
        ...tokenData,
        refresh_token: newRefreshToken.token,
    };
};

module.exports = {
    register,
    login,
    refreshAccessToken,
};

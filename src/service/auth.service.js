const { where } = require("sequelize");
const { User, Queue } = require("../db/models");
const { hash, compare } = require("../utils/bcrypt");
const jwtService = require("./jwt.service");
const refreshTokenService = require("./refreshToken.service");

const register = async (data) => {
    const check = await checkUserEmail(data.email);

    if (check) throw new Error("Email already exists.");

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

const checkUserEmail = async (email) => {
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (user) return true;
    return false;
};

const login = async (email, password) => {
    const user = await User.findOne({ where: { email }, raw: true });
    if (!user) {
        throw new Error("Invalid login credentials.");
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
        throw new Error("Invalid login credentials.");
    }

    const tokenData = jwtService.generateAccessToken(user.id);
    const refreshToken = await refreshTokenService.createRefreshToken(user.id);

    return {
        ...tokenData,
        refresh_token: refreshToken.token,
    };
};

const forgotPassword = async (email) => {
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Email do not exit");
    }

    await User.update({ verified_at: null }, { where: { id: user.id } });
    await Queue.create({
        type: "sendVerifyEmailJob",
        payload: { userId: user.id },
    });
};

const resetPassword = async (data) => {
    const { userId, password, ...remaining } = data;

    const { dataValues: user } = await User.findOne({ where: { id: userId } });
    console.log(user);

    if (!user) {
        throw new Error("Invalid login credentials.");
    }

    // const isValid = await compare(password, user.password);

    // if (isValid) throw new Error("Vui lòng nhập mật khẩu khác");

    try {
        await User.update(
            {
                password: await hash(password),
            },
            {
                where: {
                    id: userId,
                },
            }
        );
    } catch (error) {
        throw new Error(error);
    }
};

const verifyEmail = async (token) => {
    try {
        const { userId } = jwtService.verifyAccessToken(
            token,
            process.env.MAIL_JWT_SECRET
        );

        const { dataValues: user } = await User.findOne({
            where: { id: userId },
        });

        if (user.verified_at) {
            return "verified";
        }

        await User.update(
            { verified_at: Date.now() },
            {
                where: { id: userId },
            }
        );
    } catch (error) {
        throw new Error(error);
    }
};

const verifyToken = async (token) => {
    try {
        return jwtService.verifyAccessToken(token, process.env.MAIL_JWT_SECRET);
    } catch (error) {
        throw new Error(error);
    }
};

const refreshAccessToken = async (refreshTokenString) => {
    const refreshToken = await refreshTokenService.findValidRefreshToken(
        refreshTokenString
    );

    if (!refreshToken) {
        throw new Error("Refresh invalid");
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
    forgotPassword,
    verifyEmail,
    verifyToken,
    resetPassword,
    checkUserEmail,
};

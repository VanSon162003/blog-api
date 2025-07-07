const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN, TOKEN_TYPE } = require("../config/auth");

const generateAccessToken = (userId) => {
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    return {
        access_token: token,
        token_type: TOKEN_TYPE,
        expires_in: JWT_EXPIRES_IN,
    };
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    generateAccessToken,
    verifyAccessToken,
};

const transporter = require("../config/mailer");
const loadEmail = require("../utils/loadEmail");
const { User } = require("../db/models");
const jwtService = require("../service/jwt.service");
const { where } = require("sequelize");

async function sendVerifyEmailJob(job) {
    const { userId } = JSON.parse(job.dataValues.payload);

    const user = await User.findOne({
        where: {
            id: userId,
        },
    });

    // Tạo link xác thực cho userId
    const token = jwtService.generateAccessToken(
        userId,
        process.env.MAIL_JWT_SECRET,
        60 * 60 * 12
    );

    const CLIENT_URL = process.env.CLIENT_URL;
    const verifyUrl = `${CLIENT_URL}/admin/verify-email?token=${token}`;
    const data = { token, userId, verifyUrl };

    // Load email từ template ejs
    const template = await loadEmail("email/verify", data);

    const a = await transporter.sendMail({
        from: "mailer@fullstack.edu.vn",
        subject: "Verification email",
        to: user.dataValues.email,
        html: template,
    });
}
module.exports = sendVerifyEmailJob;

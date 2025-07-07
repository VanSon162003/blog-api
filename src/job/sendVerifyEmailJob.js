const transporter = require("@/configs/mailer");
const loadEmail = require("@/utils/loadEmail");
const usersService = require("@/service/users.service");
const { createToken } = require("@/utils/jwt");

async function sendVerifyEmailJob(job) {
    const { userId } = JSON.parse(job.payload);
    console.log(userId);

    const user = await usersService.getById(userId);
    console.log(user);

    // Tạo link xác thực cho userId
    const token = createToken({ userId: user.id }, { expiresIn: 60 * 60 * 12 });
    const verifyUrl = `http://localhost:3000/admin/verify-email?token=${token}`;
    const data = { token, userId, verifyUrl };

    // Load email từ template ejs
    console.log("trong temlate");

    const template = await loadEmail("email/verify", data);
    console.log(template);

    console.log(`Bắt đầu gửi email tới: ${user.email}`);

    const info = await transporter.sendMail({
        from: "mailer@fullstack.edu.vn>",
        subject: "Verification email",
        to: user.email,
        html: template,
    });

    // const verifyUrl = `${req.protocol}://${req.host}/admin/verify-email?token=${token}`;

    // await transporter.sendMail({
    //     from: "mailer@fullstack.edu.vn",
    //     to: user.email, // Gửi cho đúng tài khoản vừa đăng ký
    //     html: `
    //     <div>
    //         <p>
    //             Nhấn vào đây để xác thực:
    //         </p>
    //         <p>
    //             <a href="${verifyUrl}">Xác minh tài khoản</a>
    //         </p>
    //     </div>
    // `,
    // });

    // Update thời gian gửi email
    // await usersService.update(userId, {
    //     email_sent_at: new Date(),
    // });

    console.log(info);
}

module.exports = sendVerifyEmailJob;

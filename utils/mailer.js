const nodemailer = require('nodemailer');

const sendVerificationCode = async(email, userName = 'User', code) =>{
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #f9fafc; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(90deg, #667eea, #764ba2); padding: 20px; text-align: center;">
          <img src="https://clear-list-frontend.vercel.app/todo_app_logo.png" alt="ClearTick Logo" style="width: 60px; height: 60px; margin-bottom: 10px;">
          <h1 style="color: #ffffff; margin: 0;">ClearTick</h1>
        </div>
        <div style="padding: 20px; color: #333;">
          <h2 style="margin-top: 0;">Hello ${userName},</h2>
          <p style="font-size: 16px; color: #555;">
            We received a request to reset your password. Use the OTP below to reset it:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 28px; font-weight: bold; color: #667eea; background: #f3f4f6; padding: 10px 20px; border-radius: 8px; letter-spacing: 2px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #777;">
            This OTP will expire in 5 minutes. If you didn’t request a password reset, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} ClearTick. All rights reserved.
        </div>
      </div>
    </div>
    `;

    const info = await transporter.sendMail({
      from: `"ClearTick" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "ClearTick - Password Reset OTP",
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}
module.exports.sendVerificationCode = sendVerificationCode;
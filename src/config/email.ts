import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailConfig = {
  sendVerificationEmail: async (email: string, token: string) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Verify your email",
      html: `Please click <a href="${verificationUrl}">here</a> to verify your email.`,
    });
  },

  sendResetPasswordEmail: async (email: string, token: string) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Reset your password",
      html: `Please click <a href="${resetUrl}">here</a> to reset your password.`,
    });
  },
};

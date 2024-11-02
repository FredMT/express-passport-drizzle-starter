import bcrypt from "bcrypt";
import crypto from "crypto";
import { userRepository } from "../repositories/userRepository";
import { emailConfig } from "../../../config/email";
import { jwtConfig } from "../../../config/jwt";
import type {
  RegisterDTO,
  LoginDTO,
  ResetPasswordDTO,
} from "../types/auth.types";
import { AppError } from "../../../shared/middleware/errorHandler";

export const authService = {
  register: async (data: RegisterDTO) => {
    const existingUser = await userRepository.findByEmailOrUsername(data.email);
    if (existingUser) {
      const field = existingUser.email === data.email ? "email" : "username";
      throw new AppError(409, `This ${field} is already registered`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await userRepository.create({
      ...data,
      hashedPassword,
      verificationToken,
    });

    await emailConfig.sendVerificationEmail(data.email, verificationToken);

    return user;
  },

  verifyEmail: async (token: string) => {
    const user = await userRepository.findByVerificationToken(token);
    if (!user) {
      throw new AppError(400, "Invalid verification token");
    }

    await userRepository.updateVerification(user.id);
    return true;
  },

  login: async (data: LoginDTO) => {
    const user = await userRepository.findByEmailOrUsername(data.credential);
    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    if (!user.isVerified) {
      throw new AppError(401, "Please verify your email before logging in");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = jwtConfig.generateTokens(user.id);

    await userRepository.storeRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  },

  forgotPassword: async (email: string) => {
    const user = await userRepository.findByEmailOrUsername(email);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await userRepository.updateResetToken(user.id, resetToken, resetExpires);
    await emailConfig.sendResetPasswordEmail(email, resetToken);

    return true;
  },

  resetPassword: async (token: string, data: ResetPasswordDTO) => {
    const user = await userRepository.findByResetToken(token);
    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new AppError(400, "Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await userRepository.updatePassword(user.id, hashedPassword);

    return true;
  },
};

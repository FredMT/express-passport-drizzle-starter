import { eq, or } from "drizzle-orm";
import { db } from "../../../config/database";
import type { RegisterDTO } from "../types/auth.types";
import { refreshTokens, users } from "../../../db/schema";

export const userRepository = {
  findByEmailOrUsername: async (credential: string) => {
    return await db.query.users.findFirst({
      where: or(eq(users.email, credential), eq(users.username, credential)),
    });
  },

  findByVerificationToken: async (token: string) => {
    return await db.query.users.findFirst({
      where: eq(users.verificationToken, token),
    });
  },

  findByResetToken: async (token: string) => {
    return await db.query.users.findFirst({
      where: eq(users.resetPasswordToken, token),
    });
  },

  create: async (
    userData: RegisterDTO & {
      hashedPassword: string;
      verificationToken: string;
    }
  ) => {
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username,
        email: userData.email,
        password: userData.hashedPassword,
        verificationToken: userData.verificationToken,
      })
      .returning();
    return user;
  },

  storeRefreshToken: async (userId: number, token: string, expiresAt: Date) => {
    await db.insert(refreshTokens).values({
      userId,
      token,
      expiresAt,
    });
  },

  updateVerification: async (userId: number) => {
    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
      })
      .where(eq(users.id, userId));
  },

  updateResetToken: async (
    userId: number,
    resetToken: string,
    resetExpires: Date
  ) => {
    await db
      .update(users)
      .set({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      })
      .where(eq(users.id, userId));
  },

  updatePassword: async (userId: number, hashedPassword: string) => {
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where(eq(users.id, userId));
  },
};

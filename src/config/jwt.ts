import jwt from "jsonwebtoken";
import "dotenv/config";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const jwtConfig = {
  generateTokens: (userId: number) => {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  },

  verifyAccessToken: (token: string) => {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: number };
    } catch (error) {
      return null;
    }
  },

  verifyRefreshToken: (token: string) => {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: number };
    } catch (error) {
      return null;
    }
  },
};

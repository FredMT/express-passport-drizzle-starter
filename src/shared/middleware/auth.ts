import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { eq } from "drizzle-orm";
import { db } from "../../config/database";
import type { TokenPayload } from "../../features/auth/types/auth.types";
import { users } from "../../db/schema";
import { AppError } from "./errorHandler";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
};

passport.use(
  new JwtStrategy(options, async (payload: TokenPayload, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
      });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export const requireAuth = (req: any, res: any, next: any) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (err) {
      return next(new AppError(500, "Internal server error"));
    }

    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }

    req.user = user;
    next();
  })(req, res, next);
};

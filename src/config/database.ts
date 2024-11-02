import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";
import { refreshTokens, users } from "../db/schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { users, refreshTokens },
});

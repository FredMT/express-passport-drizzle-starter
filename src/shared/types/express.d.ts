import type { InferSelectModel } from "drizzle-orm";
import type { users } from "../../database/schema";

declare global {
  namespace Express {
    interface User extends InferSelectModel<typeof users> {}
  }
}

export {};

import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import "./src/shared/middleware/auth";
import { errorHandler } from "./src/shared/middleware/errorHandler";
import authRoutes from "./src/features/auth/routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

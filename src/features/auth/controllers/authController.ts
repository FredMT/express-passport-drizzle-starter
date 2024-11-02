import { Request, Response } from "express";
import { authService } from "../services/authService";
import { authValidator } from "../validators/authValidator";
import { asyncErrorHandler } from "../../../shared/utils";

export const authController = {
  register: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = authValidator.register.parse(req.body);
    await authService.register(data);

    res.status(201).json({
      status: "success",
      message: "Registration successful. Please verify your email.",
    });
  }),

  verifyEmail: asyncErrorHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    await authService.verifyEmail(token);

    res.json({
      status: "success",
      message: "Email verified successfully",
    });
  }),

  login: asyncErrorHandler(async (req: Request, res: Response) => {
    const data = authValidator.login.parse(req.body);
    const result = await authService.login(data);

    res.json({
      status: "success",
      data: result,
    });
  }),

  forgotPassword: asyncErrorHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.forgotPassword(email);

    res.json({
      status: "success",
      message: "Password reset email sent",
    });
  }),

  resetPassword: asyncErrorHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    const data = authValidator.resetPassword.parse(req.body);
    await authService.resetPassword(token, data);

    res.json({
      status: "success",
      message: "Password reset successful",
    });
  }),
};

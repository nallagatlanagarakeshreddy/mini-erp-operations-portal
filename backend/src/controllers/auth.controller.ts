import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { loginSchema, registerSchema } from "../validators/auth.validator";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);
    res.status(201).json({
      success: true,
      data: result,
      message: "User registered successfully",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(422).json({
        success: false,
        message: "Validation Error",
        error: error.errors,
      });
      return;
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);
    res.status(200).json({
      success: true,
      data: result,
      message: "Login successful",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(422).json({
        success: false,
        message: "Validation Error",
        error: error.errors,
      });
      return;
    }
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw { status: 401, message: "Unauthorized" };
    }
    const user = await authService.getMe(userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

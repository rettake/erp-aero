import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import userService from "../service/user.service";
import { ApiError } from "../exceptions/api-error";

class UserController {
  constructor() {}

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Validation error",
            errors.array().map((err) => err.msg)
          )
        );
      }

      const { id, password } = req.body;

      const user = await userService.signUp(id, password);

      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, password } = req.body;

      const user = await userService.signIn(id, password);

      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const token = await userService.signOut(refreshToken);

      res.clearCookie("refreshToken");
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }

  async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ message: "Working" });
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();

export default userController;

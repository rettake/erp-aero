import { NextFunction, Request, Response } from "express";

import userService from "../service/user.service";

class UserController {
  constructor() {}

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
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

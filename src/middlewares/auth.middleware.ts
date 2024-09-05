import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api-error";
import tokenService from "../service/token.service";
import { console } from "inspector";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    if (typeof userData === "string") {
      return next(ApiError.UnauthorizedError());
    }

    (req as any).user = userData;

    next();
  } catch (e) {
    next(ApiError.UnauthorizedError());
  }
}

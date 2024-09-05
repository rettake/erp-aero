import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

const { signUp, signIn, refresh, signOut, getInfo } = userController;

// Auth & User Routes
router.post(
  "/signin",
  body("id").isString(),
  body("password").isLength({ min: 6 }),
  signIn
);
router.post("/signin/new_token", authMiddleware, refresh);
router.post(
  "/signup",
  body("id").isString(),
  body("password").isLength({ min: 6 }),
  signUp
);
router.get("/logout", authMiddleware, signOut);
router.get("/info", authMiddleware, getInfo);

// File Routes

export default router;

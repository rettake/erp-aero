import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller";

const router = Router();

const { signUp, signIn, refresh, signOut, getInfo } = userController;

router.post(
  "/signin",
  body("id").isString(),
  body("password").isLength({ min: 6 }),
  signIn
);
router.post("/signin/new_token", refresh);
router.post(
  "/signup",
  body("id").isString(),
  body("password").isLength({ min: 6 }),
  signUp
);
router.get("/logout", signOut);
router.get("/info", getInfo);

export default router;

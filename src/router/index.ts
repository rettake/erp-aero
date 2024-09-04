import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

const { signUp, signIn, refresh, signOut, getInfo } = userController;

router.post("/signin", () => console.log(signIn));
router.post("/signin/new_token", refresh);
router.post("/signup", signUp);
router.get("/logout", signOut);
router.get("/info", getInfo);

export default router;

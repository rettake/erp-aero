import multer from "multer";
import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import fileController from "../controllers/file.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

const { signUp, signIn, refresh, signOut, getInfo } = userController;
const { uploadFile, getList, deleteFile, getSingle, download, update } =
  fileController;

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
router.post("/file/upload", upload.single("file"), authMiddleware, uploadFile);
router.get("/file/list", authMiddleware, getList);
router.delete("/file/delete/:id", authMiddleware, deleteFile);
router.get("/file/:id", authMiddleware, getSingle);
router.get("/file/download/:id", download);
router.put("/file/update/:id", upload.single("file"), authMiddleware, update);

export default router;

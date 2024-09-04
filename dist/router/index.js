"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
const { signUp, signIn, refresh, signOut, getInfo } = user_controller_1.default;
router.post("/signin", () => console.log(signIn));
router.post("/signin/new_token", refresh);
router.post("/signup", signUp);
router.get("/logout", signOut);
router.get("/info", getInfo);
exports.default = router;

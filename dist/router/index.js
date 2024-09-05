"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
const { signUp, signIn, refresh, signOut, getInfo } = user_controller_1.default;
router.post("/signin", signIn);
router.post("/signin/new_token", refresh);
router.post("/signup", (0, express_validator_1.body)("id").isString(), (0, express_validator_1.body)("password").isLength({ min: 6 }), signUp);
router.get("/logout", signOut);
router.get("/info", getInfo);
exports.default = router;

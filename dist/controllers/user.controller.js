"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../service/user.service"));
class UserController {
    constructor() { }
    async signUp(req, res, next) {
        try {
            const { id, password } = req.body;
            const user = await user_service_1.default.signUp(id, password);
            res.cookie("refreshToken", user.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.status(201).json(user);
        }
        catch (error) {
            console.log(error);
        }
    }
    async signIn(req, res, next) {
        try {
        }
        catch (error) { }
    }
    async refresh(req, res, next) {
        try {
        }
        catch (error) { }
    }
    async signOut(req, res, next) {
        try {
        }
        catch (error) { }
    }
    async getInfo(req, res, next) {
        try {
            res.status(200).json({ message: "Working" });
        }
        catch (error) { }
    }
}
const userController = new UserController();
exports.default = userController;

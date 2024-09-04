"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("../service/user.service");
class UserController {
    constructor(userService = new user_service_1.UserService()) {
        this.userService = userService;
    }
    async signUp(req, res, next) {
        try {
            const { id, password } = req.body;
            const user = await this.userService.signUp(id, password);
            res.cookie("refreshToken", user.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async signIn(req, res, next) {
        try {
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
        }
        catch (error) {
            next(error);
        }
    }
    async signOut(req, res, next) {
        try {
        }
        catch (error) {
            next(error);
        }
    }
    async getInfo(req, res, next) {
        try {
            res.status(200).json({ message: "Working" });
        }
        catch (error) {
            next(error);
        }
    }
}
const userController = new UserController();
exports.default = userController;

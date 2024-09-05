"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const api_error_1 = require("../exceptions/api-error");
const token_service_1 = __importDefault(require("./token.service"));
const prisma = new client_1.PrismaClient();
class UserService {
    constructor() { }
    async signUp(id, password) {
        const existUser = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (existUser) {
            throw api_error_1.ApiError.BadRequest("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                id,
                password: hashedPassword,
            },
        });
        const tokens = token_service_1.default.generateTokens(id);
        await token_service_1.default.saveToken(id, tokens.refreshToken);
        delete user.password;
        return { ...tokens, user };
    }
    async signIn(id, password) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw api_error_1.ApiError.BadRequest("User not found");
        }
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw api_error_1.ApiError.BadRequest("Wrong password");
        }
        const tokens = token_service_1.default.generateTokens(user.id);
        await token_service_1.default.saveToken(user.id, tokens.refreshToken);
        delete user.password;
        return { ...tokens, user };
    }
    async refresh() { }
    async signOut() { }
    async getInfo() { }
}
const userService = new UserService();
exports.default = userService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_service_1 = require("./token.service");
const api_error_1 = require("../exceptions/api-error");
class UserService {
    constructor(prisma = new client_1.PrismaClient(), tokenService = new token_service_1.TokenService()) {
        this.prisma = prisma;
        this.tokenService = tokenService;
    }
    async signUp(id, password) {
        const existUser = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (existUser) {
            throw api_error_1.ApiError.BadRequest("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                id,
                password: hashedPassword,
            },
        });
        const tokens = this.tokenService.generateTokens(id);
        await this.tokenService.saveToken(id, tokens.refreshToken);
        delete user.password;
        return { ...tokens, user };
    }
    async signIn() { }
    async refresh() { }
    async signOut() { }
    async getInfo() { }
}
exports.UserService = UserService;

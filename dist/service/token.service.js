"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
class TokenService {
    constructor() { }
    generateTokens(id) {
        const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.JWT_ACCESS_SECRET || "", {
            expiresIn: "1h",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.JWT_REFRESH_SECRET || "", {
            expiresIn: "30d",
        });
        return { accessToken, refreshToken };
    }
    async saveToken(id, refreshToken) {
        const tokenData = await prisma.token.findUnique({
            where: {
                userId: id,
            },
        });
        if (tokenData) {
            await prisma.token.update({
                where: {
                    userId: id,
                },
                data: {
                    refreshToken,
                },
            });
        }
        else {
            await prisma.token.create({
                data: {
                    userId: id,
                    refreshToken,
                },
            });
        }
    }
}
const tokenService = new TokenService();
exports.default = tokenService;

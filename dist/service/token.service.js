"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    constructor(prisma = new client_1.PrismaClient()) {
        this.prisma = prisma;
    }
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
        const tokenData = await this.prisma.token.findUnique({
            where: {
                userId: id,
            },
        });
        if (tokenData) {
            await this.prisma.token.update({
                where: {
                    userId: id,
                },
                data: {
                    refreshToken,
                },
            });
        }
        else {
            await this.prisma.token.create({
                data: {
                    userId: id,
                    refreshToken,
                },
            });
        }
    }
}
exports.TokenService = TokenService;
const tokenService = new TokenService();
exports.default = tokenService;

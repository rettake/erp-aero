import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export class TokenService {
  constructor(private readonly prisma: PrismaClient = new PrismaClient()) {}

  generateTokens(id: string) {
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || "", {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id },
      process.env.JWT_REFRESH_SECRET || "",
      {
        expiresIn: "30d",
      }
    );

    return { accessToken, refreshToken };
  }

  async saveToken(id: string, refreshToken: string) {
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
    } else {
      await this.prisma.token.create({
        data: {
          userId: id,
          refreshToken,
        },
      });
    }
  }
}

const tokenService = new TokenService();

export default tokenService;

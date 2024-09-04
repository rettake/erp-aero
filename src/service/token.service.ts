import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class TokenService {
  constructor() {}

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
    } else {
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

export default tokenService;

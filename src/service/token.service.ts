import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class TokenService {
  constructor() {}

  generateTokens(id: string) {
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || "", {
      expiresIn: "10m",
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

  async removeToken(refreshToken: string) {
    const tokenData = await prisma.token.delete({
      where: {
        refreshToken,
      },
    });

    return tokenData.refreshToken;
  }

  async validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "");
      return userData;
    } catch (e) {
      return null;
    }
  }

  async validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "");
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findRefreshToken(refreshToken: string) {
    const tokenData = await prisma.token.findUnique({
      where: {
        refreshToken,
      },
    });

    return tokenData;
  }
}

const tokenService = new TokenService();

export default tokenService;

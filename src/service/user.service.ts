import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { ApiError } from "../exceptions/api-error";
import tokenService from "./token.service";

const prisma = new PrismaClient();

class UserService {
  constructor() {}

  async signUp(id: string, password: string) {
    const existUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (existUser) {
      throw ApiError.BadRequest("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        id,
        password: hashedPassword,
      },
    });

    const tokens = tokenService.generateTokens(id);

    await tokenService.saveToken(id, tokens.refreshToken);

    delete (user as { password?: string }).password;

    return { ...tokens, user };
  }

  async signIn(id: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw ApiError.BadRequest("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw ApiError.BadRequest("Wrong password");
    }

    const tokens = tokenService.generateTokens(user.id);

    await tokenService.saveToken(user.id, tokens.refreshToken);

    delete (user as { password?: string }).password;

    return { ...tokens, user };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = await tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findRefreshToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    if (typeof userData === "string") {
      throw ApiError.UnauthorizedError();
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userData.id,
      },
    });

    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const tokens = tokenService.generateTokens(user.id);

    await tokenService.saveToken(user.id, tokens.refreshToken);

    delete (user as { password?: string }).password;

    return { ...tokens, user };
  }

  async signOut(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async getInfo(refreshToken: string) {
    const userData = await tokenService.validateRefreshToken(refreshToken);

    if (!userData || typeof userData === "string") {
      throw ApiError.UnauthorizedError();
    }

    const user = await prisma.user.findUnique({ where: { id: userData.id } });

    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    return user.id;
  }
}

const userService = new UserService();

export default userService;

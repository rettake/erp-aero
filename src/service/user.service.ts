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

  async signIn() {}

  async refresh() {}

  async signOut() {}

  async getInfo() {}
}

const userService = new UserService();

export default userService;

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { TokenService } from "./token.service";
import { ApiError } from "../exceptions/api-error";

export class UserService {
  constructor(
    private readonly prisma: PrismaClient = new PrismaClient(),
    private readonly tokenService: TokenService = new TokenService()
  ) {}

  async signUp(id: string, password: string) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (existUser) {
      throw ApiError.BadRequest("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        id,
        password: hashedPassword,
      },
    });

    const tokens = this.tokenService.generateTokens(id);

    await this.tokenService.saveToken(id, tokens.refreshToken);

    delete (user as { password?: string }).password;

    return { ...tokens, user };
  }

  async signIn() {}

  async refresh() {}

  async signOut() {}

  async getInfo() {}
}

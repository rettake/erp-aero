import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

class FileService {
  private uploadDir = path.join(__dirname, "uploads");

  constructor() {}

  async upload(file: Express.Multer.File) {
    const uploadedFile = await prisma.file.create({
      data: {
        name: file.originalname,
        path: file.path,
        extension: file.originalname.split(".")[1],
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    return uploadedFile;
  }

  async getList(listSize: number, page: number) {
    const files = await prisma.file.findMany({
      skip: (page - 1) * listSize,
      take: listSize,
    });

    return files;
  }

  async delete(id: string, path: string) {
    await prisma.file.delete({
      where: {
        id,
      },
    });

    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  }

  async getSingle(id: string) {
    const file = await prisma.file.findUnique({
      where: {
        id,
      },
    });

    return file;
  }

  async update() {}
}

const fileService = new FileService();

export default fileService;

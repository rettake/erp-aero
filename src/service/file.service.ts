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

  async delete(id: string) {
    await prisma.file.delete({
      where: {
        id,
      },
    });

    const filePath = path.join(this.uploadDir, id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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

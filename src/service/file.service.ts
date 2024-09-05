import { PrismaClient } from "@prisma/client";
import { ApiError } from "../exceptions/api-error";

const prisma = new PrismaClient();

class FileService {
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

  async getList() {}

  async delete() {}

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

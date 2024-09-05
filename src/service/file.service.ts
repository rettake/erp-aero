import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import { ApiError } from "../exceptions/api-error";

const prisma = new PrismaClient();

class FileService {
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

  async update(file: Express.Multer.File, fileId: string) {
    const prevFile = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!prevFile) {
      return ApiError.BadRequest("File not found");
    }

    if (fs.existsSync(prevFile.path)) {
      fs.unlinkSync(prevFile.path);
    }

    const updatedFile = await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        name: file.originalname,
        path: file.path,
        extension: file.originalname.split(".")[1],
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    return updatedFile;
  }
}

const fileService = new FileService();

export default fileService;

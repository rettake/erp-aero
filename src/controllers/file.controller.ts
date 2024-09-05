import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/api-error";
import fileService from "../service/file.service";

class FileController {
  constructor() {}

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      if (!file) {
        return next(ApiError.BadRequest("No file uploaded"));
      }

      const uploadedFile = await fileService.upload(file);

      if (!uploadedFile) {
        return next(ApiError.BadRequest("File not uploaded"));
      }

      res.status(201).json(uploadedFile);
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async getSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const file = await fileService.getSingle(req.params.id);

      if (!file) {
        return next(ApiError.BadRequest("File not found"));
      }

      res.status(200).json(file);
    } catch (error) {
      next(error);
    }
  }

  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const fileId = req.params.id;
      const file = await fileService.getSingle(fileId);

      if (!file) {
        return next(ApiError.BadRequest("File not found"));
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.name}"`
      );
      res.setHeader("Content-Type", file.mimeType);
      res.setHeader("Content-Length", file.size);

      // Возвращаем файл в ответе
      res.status(200).send(file);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

const fileController = new FileController();

export default fileController;

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
      const listSize = req.query.list_size
        ? parseInt(String(req.query.list_size), 10)
        : 10;
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;

      const files = await fileService.getList(listSize, page);

      res.status(200).json({
        files,
        totalPages: Math.ceil(files.length / listSize),
        page: page,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const fileId = req.params.id;
      const file = await fileService.getSingle(fileId);

      if (!file) {
        return next(ApiError.BadRequest("File not found"));
      }

      await fileService.delete(fileId, file.path);

      res.status(200).json({ message: "File deleted successfully" });
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

      res.status(200).send(file);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const fileId = req.params.id;

      if (!file) {
        return next(ApiError.BadRequest("No file uploaded"));
      }

      const uploadedFile = await fileService.update(file, fileId);

      if (!uploadedFile) {
        return next(ApiError.BadRequest("File not uploaded"));
      }

      res.status(201).json(uploadedFile);
    } catch (error) {
      next(error);
    }
  }
}

const fileController = new FileController();

export default fileController;

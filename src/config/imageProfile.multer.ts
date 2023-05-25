import "dotenv/config";
import { AppError } from "../errors/errors";
import { Request } from "express";

export default {
  fileFilter: (
    request: Request,
    file: Express.Multer.File,
    callback: Function
  ) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new AppError("Only images are allowed!"), false);
    }
  },
  limits: {
    fileSize: 1 * 1024 * 1024, // 1mb em bytes
  },
};

import { Request, Response } from "express";
import expressRateLimit from "express-rate-limit";
import JsonFileStore from "./jsonFileStore.config";
import { AppError } from "../errors/errors";

export const midiaUploadRateLimit = expressRateLimit({
  store: new JsonFileStore("midiaUploadRateLimit.json"),
  windowMs: 30 * 60 * 1000, // 30 minutos
  max: 1,
  handler: function (req: Request, res: Response) {
    throw new AppError(
      "You have reached your image upload limit. Please try again later.",
      429
    );
  },
});

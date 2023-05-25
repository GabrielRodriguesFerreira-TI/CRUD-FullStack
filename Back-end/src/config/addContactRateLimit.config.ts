import { Request, Response } from "express";
import expressRateLimit from "express-rate-limit";
import JsonFileStore from "./jsonFileStore.config";
import { AppError } from "../errors/errors";

export const addContactRateLimit = expressRateLimit({
  store: new JsonFileStore("addContactRateLimit.json"),
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10,
  handler: function (req: Request, res: Response) {
    throw new AppError(
      "You have reached your add contact limit. Please try again later.",
      429
    );
  },
});

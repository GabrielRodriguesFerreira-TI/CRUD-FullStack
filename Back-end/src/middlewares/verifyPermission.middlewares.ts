import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/errors";

export const verifyPermissionMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customerId = res.locals.customerDecoded;
  const paramsId = req.params.customer_id;

  if (customerId !== paramsId) {
    throw new AppError("Insufficient permission", 403);
  }

  return next();
};

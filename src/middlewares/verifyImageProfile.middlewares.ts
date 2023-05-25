import { NextFunction, Request, Response } from "express";

import S3Storage from "../utils/S3Storage";
import { Customer } from "../models/Customer.model";

export const verifyImageProfileMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customerId: string = req.params.customer_id;

  const customer = await Customer.findById(customerId);

  if (customer?.imageProfile) {
    const s3Storage = new S3Storage();

    await s3Storage.deleteFile(customer.imageProfile);
  }

  return next();
};

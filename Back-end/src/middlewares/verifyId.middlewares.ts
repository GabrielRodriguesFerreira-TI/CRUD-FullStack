import { NextFunction, Request, Response } from "express";
import { Customer } from "../models/Customer.model";
import { AppError } from "../errors/errors";

export const verifyIdExistsMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customersParams: string = req.params.customer_id;

  if (customersParams) {
    const customer = await Customer.findById(customersParams);

    if (!customer) {
      throw new AppError("Customer not found!", 404);
    }
  }

  return next();
};

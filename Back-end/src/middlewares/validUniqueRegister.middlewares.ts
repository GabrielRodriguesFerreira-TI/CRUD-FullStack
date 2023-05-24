import { NextFunction, Request, Response } from "express";
import { Customer } from "../models/Customer.model";
import { AppError } from "../errors/errors";

export const validateUniqueRegisterMiddleare = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customerId = req.params.id;
  const payload = req.body;

  const customer = customerId
    ? await Customer.findById(customerId)
    : new Customer(payload);

  if (customer) {
    const { email, telephone } = payload;

    const existingEmail = await Customer.findOne({
      _id: { $ne: customer._id },
      emails: { $in: email },
    });

    if (existingEmail) {
      const errorMessage = `The email '${email}' is already in use.`;
      throw new AppError(errorMessage, 409);
    }

    const existingTelephone = await Customer.findOne({
      _id: { $ne: customer._id },
      telephones: { $in: telephone },
    });

    if (existingTelephone) {
      const errorMessage = `The phone '${telephone}' is already in use.`;
      throw new AppError(errorMessage, 409);
    }
  }

  next();
};

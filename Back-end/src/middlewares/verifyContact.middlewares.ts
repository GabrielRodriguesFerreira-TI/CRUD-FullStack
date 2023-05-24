import { NextFunction, Request, Response } from "express";
import { Customer } from "../models/Customer.model";
import { AppError } from "../errors/errors";

export const verifyContactMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, telephone } = req.body;
  const { customer_id } = req.params;

  const customersEmail = await Customer.find({ emails: email });
  const customersTelephone = await Customer.find({ telephones: telephone });

  const isOwnerEmail = customersEmail.some((customer) =>
    customer._id.equals(customer_id)
  );

  if (isOwnerEmail) {
    throw new AppError("Email belongs to the current customer", 403);
  }

  const isOwnerTelephone = customersTelephone.some((customer) =>
    customer._id.equals(customer_id)
  );

  if (isOwnerTelephone) {
    throw new AppError("Telephoone belongs to the current customer", 403);
  }

  next();
};

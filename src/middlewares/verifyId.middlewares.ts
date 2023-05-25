import { NextFunction, Request, Response } from "express";
import { Customer } from "../models/Customer.model";
import { AppError } from "../errors/errors";
import { Contact } from "../models/Contacts.model";

export const verifyIdExistsMiddlewares = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customersParams: string = req.params.customer_id;
  const contactsParams: string = req.params.contact_id;

  if (customersParams) {
    const customer = await Customer.findById(customersParams);

    if (!customer) {
      throw new AppError("Customer not found!", 404);
    }
  }

  if (contactsParams) {
    const contact = await Contact.findById(contactsParams);

    if (!contact) {
      throw new AppError("Contact not found!", 404);
    }
  }

  return next();
};

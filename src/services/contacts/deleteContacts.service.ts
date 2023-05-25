import { Request, Response } from "express";
import { Contact } from "../../models/Contacts.model";
import { Customer } from "../../models/Customer.model";
import { AppError } from "../../errors/errors";
import mongoose from "mongoose";

export const deleteContactsService = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { customer_id, contact_id } = req.params;

  await Contact.findByIdAndDelete(contact_id);

  const customer = await Customer.findById(customer_id);

  const contactIndex = customer?.contacts.findIndex((contact) =>
    contact._id.equals(new mongoose.Types.ObjectId(contact_id))
  );

  if (contactIndex === -1) {
    throw new AppError("Contact not found for the customer", 404);
  }

  customer?.contacts.splice(contactIndex!, 1);

  await customer?.save();
};

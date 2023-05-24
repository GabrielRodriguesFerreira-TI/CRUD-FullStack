import { Request } from "express";
import { AppError } from "../../errors/errors";
import {
  iCreateContact,
  iReturnCreatedContact,
} from "../../interfaces/contacts/contacts.types";
import { Customer } from "../../models/Customer.model";
import { Contact } from "../../models/Contacts.model";

export const createContactsService = async (
  payload: iCreateContact,
  req: Request
): Promise<iReturnCreatedContact> => {
  const { email, telephone } = payload;
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

  const customer = await Customer.findById(customer_id);

  const newPayload = {
    ...payload,
    owner: customer_id,
  };

  const contact = new Contact({
    ...newPayload,
  });

  await contact.save();

  customer?.contacts.push(contact._id);

  await customer?.save();

  const returnedContact =
    contact.ReturnedNewContact() as unknown as iReturnCreatedContact;

  return returnedContact;
};

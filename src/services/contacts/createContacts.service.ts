import { Request } from "express";
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
  const { customer_id } = req.params;

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

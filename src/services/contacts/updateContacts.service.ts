import { Request } from "express";
import { iUpdateContact } from "../../interfaces/contacts/contacts.types";
import { Contact } from "../../models/Contacts.model";

export const updateContactsService = async (
  payload: iUpdateContact,
  req: Request
) => {
  const { contact_id } = req.params;

  const contact = await Contact.findByIdAndUpdate(
    contact_id,
    { $set: payload },
    { new: true }
  ).select("-__v -updatedAt -createdAt");

  return contact;
};

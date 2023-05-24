import { Request, Response } from "express";
import * as Contacts from "../../services/contacts/index";
import {
  iCreateContact,
  iReturnCreatedContact,
  iUpdateContact,
} from "../../interfaces/contacts/contacts.types";

export const createContactsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactInfo: iCreateContact = req.body;

  const contactCreated: iReturnCreatedContact =
    await Contacts.createContactsService(contactInfo, req);

  return res.status(201).json(contactCreated);
};

export const updateContactsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactInfo: iUpdateContact = req.body;

  const updatedContact = await Contacts.updateContactsService(contactInfo, req);

  return res.status(200).json(updatedContact);
};

export const deleteContactsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  await Contacts.deleteContactsService(req, res);

  return res.status(204).send();
};

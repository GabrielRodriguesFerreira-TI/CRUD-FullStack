import { Request, Response } from "express";
import * as Contacts from "../../services/contacts/index";
import {
  iCreateContact,
  iReturnCreatedContact,
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

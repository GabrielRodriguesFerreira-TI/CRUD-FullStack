import { z } from "zod";
import mongoose, { Document } from "mongoose";
import {
  createContactSchema,
  returnCreatedContactSchema,
  updateContactSchema,
} from "../../schemas/contacts/contacts.schemas";

export type iCreateContact = z.infer<typeof createContactSchema>;

export type iReturnCreatedContact = z.infer<typeof returnCreatedContactSchema>;

export type iUpdateContact = z.infer<typeof updateContactSchema>;

export interface iCreateContactModel extends Document {
  fullName: string;
  email: string;
  telephone: string;
  owner: mongoose.Schema.Types.ObjectId;
  ReturnedNewContact: () => Omit<this, "__v" | "updatedAt">;
}

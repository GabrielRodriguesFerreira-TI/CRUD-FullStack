import { z } from "zod";
import mongoose, { Document } from "mongoose";
import { createContactSchema } from "../../schemas/contacts/contacts.schemas";

export interface iCreateContactModel extends Document {
  fullName: string;
  email: string;
  telephone: string;
  owner: mongoose.Schema.Types.ObjectId;
}

export type iCreateContact = z.infer<typeof createContactSchema>;

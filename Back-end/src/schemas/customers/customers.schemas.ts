import { z } from "zod";
import { ObjectId } from "mongodb";

export const createCustomerSchema = z.object({
  fullName: z.string().max(50).min(4),
  password: z.string().max(200).min(4),
  email: z.string().email(),
  telephone: z.string(),
});

export const returnCreatedCustomerSchema = z.object({
  _id: z.string().transform((value) => new ObjectId(value)),
  fullName: z.string(),
  emails: z.array(z.string()),
  telephones: z.array(z.string()),
  contacts: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

import { z } from "zod";
import { ObjectId } from "mongodb";

export const createContactSchema = z.object({
  fullName: z.string().max(50).min(4),
  email: z.string().email(),
  telephone: z
    .string({
      invalid_type_error:
        "Invalid phone. Use the format (XX) XXXX-XXXX or (XXX) XXX-XXXX.",
    })
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/)
    .or(z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/)),
});

export const returnCreatedContactSchema = z.object({
  _id: z.string().transform((value) => new ObjectId(value)),
  fullName: z.string(),
  email: z.string(),
  telephone: z.string(),
  createdAt: z.string(),
});

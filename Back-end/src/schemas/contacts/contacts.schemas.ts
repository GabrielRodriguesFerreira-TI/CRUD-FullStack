import { z } from "zod";

export const createContactSchema = z.object({
  fullName: z.string().max(50).min(4),
  email: z.string().email(),
  telephone: z.number(),
});

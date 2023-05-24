import { z } from "zod";

export const customerLoginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(4),
});

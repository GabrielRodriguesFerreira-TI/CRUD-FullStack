import { z } from "zod";
import mongoose, { Document } from "mongoose";
import { createUserSchema } from "../../schemas/users/users.schemas";

export interface iCreateUserModel extends Document {
  fullName: string;
  password: string;
  emails: object[];
  telephones: object[];
  contacts: [mongoose.Schema.Types.ObjectId];
  UserWithoutPassword: () => Omit<this, "password">;
}

export type iCreateUser = z.infer<typeof createUserSchema>;

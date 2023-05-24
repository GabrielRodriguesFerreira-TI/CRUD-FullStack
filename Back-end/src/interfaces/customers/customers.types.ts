import { z } from "zod";
import mongoose, { Document } from "mongoose";
import {
  createCustomerSchema,
  returnCreatedCustomerSchema,
} from "../../schemas/customers/customers.schemas";

export type iCreateCustomer = z.infer<typeof createCustomerSchema>;

export type iReturnCreatedCustomer = z.infer<
  typeof returnCreatedCustomerSchema
>;

export interface iCreateCustomerModel extends Document {
  fullName: string;
  password: string;
  emails: string[];
  telephones: string[];
  contacts: [mongoose.Schema.Types.ObjectId];
  CustomerWithoutPassword: () => Omit<this, "password">;
}

export type iCreateFillEmailsAndTelephones = mongoose.Document<
  unknown,
  any,
  iCreateCustomerModel
> &
  Omit<
    iCreateCustomerModel & {
      _id: mongoose.Types.ObjectId;
    },
    never
  >;

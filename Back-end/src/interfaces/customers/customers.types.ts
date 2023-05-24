import { z } from "zod";
import mongoose, { Document, Types } from "mongoose";
import {
  createCustomerSchema,
  returnCreatedCustomerSchema,
  returnUpdateCustomerSchema,
  updateCustomerSchema,
} from "../../schemas/customers/customers.schemas";
import { ParamType } from "./customersLogin.types";

export type iCreateCustomer = z.infer<typeof createCustomerSchema>;

export type iReturnCreatedCustomer = z.infer<
  typeof returnCreatedCustomerSchema
>;

export type iUpdateCustomer = z.infer<typeof updateCustomerSchema>;

export type iReturnUpdateCustomer = z.infer<typeof returnUpdateCustomerSchema>;

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

export interface iQueryValues {
  page: ParamType;
  limit: ParamType;
}

export interface iRetrieveCustomerPagination {
  customers: iCreateCustomerModel[];
  total: number;
  limit: number;
  page?: number;
  totalPages?: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  meta?: any;
}

export interface iRetrieveOneCustomer {
  _id: Types.ObjectId;
  fullName: string;
  emails: string[];
  telephones: string[];
  contacts: [mongoose.Schema.Types.ObjectId];
  createdAt?: string;
  updatedAt?: string;
}

import { z } from "zod";
import { customerLoginSchema } from "../../schemas/customers/customersLogin.schemas";
import QueryString from "qs";

export type iLoginCustomer = z.infer<typeof customerLoginSchema>;

export type ParamType =
  | string
  | QueryString.ParsedQs
  | string[]
  | QueryString.ParsedQs[]
  | undefined;

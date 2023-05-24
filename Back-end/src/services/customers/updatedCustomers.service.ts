import { Request } from "express";
import {
  iReturnUpdateCustomer,
  iUpdateCustomer,
} from "../../interfaces/customers/customers.types";
import { Customer } from "../../models/Customer.model";
import { hashSync } from "bcryptjs";

export const updateCustomersService = async (
  body: iUpdateCustomer,
  req: Request
): Promise<iReturnUpdateCustomer> => {
  const { customer_id } = req.params;
  const { email, telephone, fullName, password } = body;

  const updateBody: any = {};

  if (email) {
    updateBody.$addToSet = { emails: email };
  }

  if (telephone) {
    updateBody.$addToSet = { telephones: telephone };
  }

  if (fullName) {
    updateBody.fullName = fullName;
  }

  if (password) {
    body.password = hashSync(body.password!, 10);
    updateBody.password = body.password;
  }

  const customer = await Customer.findByIdAndUpdate(customer_id, updateBody, {
    new: true,
  }).select("-contacts");

  const returnCustomer =
    customer!.CustomerWithoutPassword() as unknown as iReturnUpdateCustomer;

  return returnCustomer;
};

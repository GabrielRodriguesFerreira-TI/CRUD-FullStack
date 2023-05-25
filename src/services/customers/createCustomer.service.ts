import {
  iCreateCustomer,
  iCreateFillEmailsAndTelephones,
  iReturnCreatedCustomer,
} from "../../interfaces/customers/customers.types";
import { Customer } from "../../models/Customer.model";

export const createCustomerService = async (
  payload: iCreateCustomer
): Promise<iReturnCreatedCustomer> => {
  const customer = (await Customer.createAndFillEmailsAndTelephones(
    payload
  )) as iCreateFillEmailsAndTelephones;
  const userWithoutPassword =
    customer.CustomerWithoutPassword() as unknown as iReturnCreatedCustomer;

  return userWithoutPassword;
};

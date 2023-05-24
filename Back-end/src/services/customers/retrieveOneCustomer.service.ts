import { Request } from "express";
import { iRetrieveOneCustomer } from "../../interfaces/customers/customers.types";
import { Customer } from "../../models/Customer.model";

export const retrieveOneCustomerService = async (
  req: Request
): Promise<iRetrieveOneCustomer> => {
  const customerId: string = req.params.customer_id;

  const customer = await Customer.findOne({
    _id: customerId,
  });

  const customerReturn = customer!.CustomerWithoutPassword();

  return customerReturn;
};

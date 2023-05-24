import { Request, Response } from "express";
import {
  iCreateCustomer,
  iReturnCreatedCustomer,
} from "../../interfaces/customers/customers.types";
import * as Users from "../../services/customers/index";

export const createCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const customerBody: iCreateCustomer = req.body;

  const createdCustomer: iReturnCreatedCustomer =
    await Users.createCustomerService(customerBody);

  return res.status(201).json(createdCustomer);
};

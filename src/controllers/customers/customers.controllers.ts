import { Request, Response } from "express";
import {
  iCreateCustomer,
  iQueryValues,
  iRetrieveCustomerPagination,
  iRetrieveOneCustomer,
  iReturnCreatedCustomer,
  iReturnUpdateCustomer,
  iUpdateCustomer,
} from "../../interfaces/customers/customers.types";
import * as Customers from "../../services/customers/index";

export const createCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const customerBody: iCreateCustomer = req.body;

  const createdCustomer: iReturnCreatedCustomer =
    await Customers.createCustomerService(customerBody);

  return res.status(201).json(createdCustomer);
};

export const retrieveCustomersController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryValues: iQueryValues = {
    page: req.query.page,
    limit: req.query.limit,
  };

  const customers: iRetrieveCustomerPagination =
    await Customers.retrieveCustomersService(queryValues);

  return res.status(200).json(customers);
};

export const retrieveOneCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const customer: iRetrieveOneCustomer =
    await Customers.retrieveOneCustomerService(req);

  return res.status(200).json(customer);
};

export const updateCustomersController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const customerInfo: iUpdateCustomer = req.body;

  const updatedUser: iReturnUpdateCustomer =
    await Customers.updateCustomersService(customerInfo, req);

  return res.status(200).json(updatedUser);
};

export const deleteCustomersController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  await Customers.deleteCustomersService(req, res);

  return res.status(204).send();
};

export const uploadCustomerProfileImageController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const file = req.file!;
  const customerId: string = req.params.customer_id;

  const response: { message: string } =
    await Customers.uploadCustomerProfileImageService(file, customerId);

  return res.status(200).json(response);
};

export const deleteCustomerProfileImageController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const file: string = req.params.filename;
  const customerId: string = req.params.customer_id;

  await Customers.deleteCustomersProfileImageService(file, customerId);

  return res.sendStatus(204);
};

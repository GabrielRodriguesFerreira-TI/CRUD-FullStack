import { Request, Response } from "express";
import {
  ParamType,
  iLoginCustomer,
} from "../../interfaces/customers/customersLogin.types";
import * as CustomersLogin from "../../services/customersLogin/index";

export const customerLoginController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const customerInfo: iLoginCustomer = req.body;

  const token: string = await CustomersLogin.createCustomerService(
    customerInfo,
    res
  );

  return res.json(token);
};

export const customerRefreshTokenController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshToken: ParamType = req.query.refreshToken;

  const response = await CustomersLogin.customerRefreshTokenService(
    refreshToken,
    res,
    req
  );

  return res.status(200).json(response);
};

export const customerLogoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const response = await CustomersLogin.customerLogoutService(res);

  return res.status(200).json(response);
};

import { Request, Response } from "express";
import { Customer } from "../../models/Customer.model";

export const deleteCustomersService = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { customer_id } = req.params;

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  await Customer.deleteOne({ _id: customer_id });
};

import { Request, Response } from "express";
import { Customer } from "../../models/Customer.model";
import { Contact } from "../../models/Contacts.model";

export const deleteCustomersService = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { customer_id } = req.params;

  const customer = await Customer.findById(customer_id);

  const contactIds = customer?.contacts;

  await Contact.deleteMany({ _id: { $in: contactIds }, owner: customer_id });

  await Customer.deleteOne({ _id: customer_id });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

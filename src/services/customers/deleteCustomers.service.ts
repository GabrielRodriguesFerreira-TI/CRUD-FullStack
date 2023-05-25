import { Request, Response } from "express";
import { Customer } from "../../models/Customer.model";
import { Contact } from "../../models/Contacts.model";
import S3Storage from "../../utils/S3Storage";

export const deleteCustomersService = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { customer_id } = req.params;

  const customer = await Customer.findById(customer_id);

  const contactIds = customer?.contacts;

  if (customer?.imageProfile) {
    const s3Storage = new S3Storage();
    await s3Storage.deleteFile(customer.imageProfile);
  }

  await Contact.deleteMany({ _id: { $in: contactIds }, owner: customer_id });

  await Customer.deleteOne({ _id: customer_id });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

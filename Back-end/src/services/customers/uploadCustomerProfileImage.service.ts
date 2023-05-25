import crypto from "crypto";
import S3Storage from "../../utils/S3Storage";
import { Customer } from "../../models/Customer.model";

export const uploadCustomerProfileImageService = async (
  file: Express.Multer.File,
  customerId: string
): Promise<{ message: string }> => {
  const filename = `${crypto.randomBytes(10).toString("hex")}-${
    file!.originalname
  }`;

  const s3Storage = new S3Storage();
  await Customer.findByIdAndUpdate(customerId, {
    $set: {
      imageProfile: String(filename),
    },
  });

  await s3Storage.saveFile(filename, file.buffer, file.mimetype);

  return { message: `${filename}` };
};

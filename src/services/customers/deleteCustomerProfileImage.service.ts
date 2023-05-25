import { Customer } from "../../models/Customer.model";
import S3Storage from "../../utils/S3Storage";

export const deleteCustomersProfileImageService = async (
  file: string,
  customerId: string
): Promise<void> => {
  const s3Storage = new S3Storage();

  await Customer.findByIdAndUpdate(customerId, {
    $set: { imageProfile: null },
  });

  await s3Storage.deleteFile(file);
};

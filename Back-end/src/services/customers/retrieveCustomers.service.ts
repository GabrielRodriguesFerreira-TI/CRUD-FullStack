import {
  iQueryValues,
  iRetrieveCustomerPagination,
} from "../../interfaces/customers/customers.types";
import { Customer } from "../../models/Customer.model";

export const retrieveCustomersService = async (
  params: iQueryValues
): Promise<iRetrieveCustomerPagination> => {
  let limitNumber = parseInt((params.limit as unknown as string) ?? "5");
  let pageNumber = parseInt((params.page as unknown as string) ?? "1");

  if (isNaN(limitNumber)) {
    limitNumber = 5;
  }

  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }

  const countDocuments = await Customer.countDocuments();

  if (countDocuments < limitNumber) {
    limitNumber = countDocuments;
  }

  const query = { deletedAt: { $exists: false } };
  const options = {
    page: pageNumber,
    limit: limitNumber,
    select: "-password -__v -contacts",
    sort: { createdAt: -1 },
    lean: true,
    customLabels: {
      totalDocs: "total",
      docs: "customers",
    },
  };

  const customers = (await Customer.paginate(
    query,
    options
  )) as unknown as iRetrieveCustomerPagination;

  return customers;
};

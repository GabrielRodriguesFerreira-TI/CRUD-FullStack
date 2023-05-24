import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { iCreateCustomerModel } from "../interfaces/customers/customers.types";

export function addPasswordHashingToSchema(
  schema: Schema<iCreateCustomerModel>
): void {
  schema.pre("save", async function (next) {
    const customer = this;

    if (!customer.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(customer.password, salt);

    customer.password = hash;
    next();
  });
}

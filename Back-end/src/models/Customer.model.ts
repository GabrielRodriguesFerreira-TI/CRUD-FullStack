import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  iCreateCustomer,
  iCreateCustomerModel,
} from "../interfaces/customers/customers.types";
import { iCustomModel } from "../interfaces/global/paginate.types";
import { addPasswordHashingToSchema } from "../hooks/hashingPassword";
import { AppError } from "../errors/errors";

const customerSchema = new mongoose.Schema<iCreateCustomerModel>(
  {
    fullName: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 4,
    },
    password: {
      type: String,
      required: true,
      maxlength: 200,
      minlength: 4,
    },
    emails: {
      type: [String],
      required: true,
      unique: true,
    },
    telephones: {
      type: [String],
      required: true,
      unique: true,
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contacts",
        required: false,
      },
    ],
  },
  { timestamps: true, autoCreate: false }
);

customerSchema.plugin(mongoosePaginate);

addPasswordHashingToSchema(customerSchema);

customerSchema.pre<iCreateCustomerModel>("save", async function (next) {
  const customer = this;

  const emailDuplicates = await Customer.find({
    _id: { $ne: customer._id },
    emails: { $in: customer.emails },
  });

  if (emailDuplicates.length > 0) {
    const duplicateEmails = emailDuplicates.map((c) => c.emails).flat();
    const errorMessage = `The following emails are already in use: ${duplicateEmails.join(
      ", "
    )}`;
    throw new AppError(errorMessage, 409);
  }

  const telephoneDuplicates = await Customer.find({
    _id: { $ne: customer._id },
    telephones: { $in: customer.telephones },
  });

  if (telephoneDuplicates.length > 0) {
    const duplicateTelephones = telephoneDuplicates
      .map((c) => c.telephones)
      .flat();
    const errorMessage = `The following phones are already in use: ${duplicateTelephones.join(
      ", "
    )}`;
    throw new AppError(errorMessage, 409);
  }

  next();
});

customerSchema.statics.createAndFillEmailsAndTelephones = async function (
  payload: iCreateCustomer
) {
  const { fullName, email, telephone, password } = payload;

  const customer = new this({ fullName, password });
  if (email) {
    customer.emails.push(email);
  }
  if (telephone) {
    customer.telephones.push(telephone);
  }

  await customer.save();
  return customer;
};

customerSchema.methods.CustomerWithoutPassword = function () {
  const user = this.toObject();
  delete user.contacts;
  delete user.__v;
  delete user.password;
  return user;
};

export const Customer = mongoose.model<
  iCreateCustomerModel,
  iCustomModel<iCreateCustomerModel>
>("Customers", customerSchema);

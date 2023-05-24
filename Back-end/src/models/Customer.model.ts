import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  iCreateCustomer,
  iCreateCustomerModel,
} from "../interfaces/customers/customers.types";
import { iCustomModel } from "../interfaces/global/paginate.types";
import { addPasswordHashingToSchema } from "../hooks/hashingPassword";

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
    },
    telephones: {
      type: [String],
      required: true,
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
  delete user.__v;
  delete user.password;
  return user;
};

export const Customer = mongoose.model<
  iCreateCustomerModel,
  iCustomModel<iCreateCustomerModel>
>("Customers", customerSchema);

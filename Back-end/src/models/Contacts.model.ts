import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { iCreateContactModel } from "../interfaces/contacts/contacts.types";
import { iCustomModel } from "../interfaces/global/paginate.types";

const contactSchema = new mongoose.Schema<iCreateContactModel>(
  {
    fullName: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telephone: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
  },
  { timestamps: true, autoCreate: false }
);

contactSchema.plugin(mongoosePaginate);

contactSchema.methods.ReturnedNewContact = function () {
  const contact = this.toObject();
  delete contact.__v;
  delete contact.updatedAt;
  return contact;
};

export const Contact = mongoose.model<
  iCreateContactModel,
  iCustomModel<iCreateContactModel>
>("Contacts", contactSchema);

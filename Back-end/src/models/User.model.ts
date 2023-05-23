import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { iCreateUserModel } from "../interfaces/users/users.types";
import { iCustomModel } from "../interfaces/global/paginate.types";

const userSchema = new mongoose.Schema<iCreateUserModel>(
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
    emails: [
      {
        email: {
          type: String,
          required: true,
          unique: true,
        },
      },
    ],
    telephones: [
      {
        telephone: {
          type: String,
          required: true,
          unique: true,
        },
      },
    ],
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

userSchema.plugin(mongoosePaginate);

userSchema.methods.UserWithoutPassword = function () {
  const user = this.toObject();
  delete user.__v;
  delete user.password;
  return user;
};

export const User = mongoose.model<
  iCreateUserModel,
  iCustomModel<iCreateUserModel>
>("Users", userSchema);

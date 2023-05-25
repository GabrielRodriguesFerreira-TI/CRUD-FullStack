import "dotenv/config";
import { Response } from "express";
import { iLoginCustomer } from "../../interfaces/customers/customersLogin.types";
import { Customer } from "../../models/Customer.model";
import { AppError } from "../../errors/errors";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const createCustomerService = async (
  payload: iLoginCustomer,
  res: Response
): Promise<any> => {
  const { email, password } = payload;

  const customer = await Customer.findOne({ emails: email });

  if (!customer) {
    throw new AppError(
      "Email not registered, please register a new email!",
      401
    );
  }

  const pwdMatch: boolean = await compare(password, customer.password);

  if (!pwdMatch) {
    throw new AppError("Incorrect password", 401);
  }

  const accessToken: string = sign(
    { email: email },
    String(process.env.ACCESS_TOKEN_SECRET),
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_LIFE),
      subject: String(customer._id),
    }
  );

  const refreshToken: string = sign(
    { email: email },
    String(process.env.REFRESH_TOKEN_SECRET),
    {
      expiresIn: Number(process.env.REFRESH_TOKEN_LIFE),
      subject: String(customer._id),
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: Number(process.env.ACCESS_COOKIE_LIFE),
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: Number(process.env.REFRESH_COOKIE_LIFE),
  });

  return { accessToken, refreshToken };
};

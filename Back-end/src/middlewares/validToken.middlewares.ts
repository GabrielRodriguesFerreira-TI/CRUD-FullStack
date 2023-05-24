import { NextFunction, Request, Response } from "express";
import { VerifyErrors, verify } from "jsonwebtoken";
import { ParamType } from "../interfaces/customers/customersLogin.types";
import { AppError } from "../errors/errors";

export const tokenValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const reqToken: string | undefined = req.headers.authorization;
  const accessToken: string | undefined = req.cookies.accessToken;
  const paramsToken: ParamType = req.query.accessToken;

  if (!reqToken) {
    throw new AppError("Missing bearer token", 401);
  }

  if (!accessToken && !paramsToken) {
    throw new AppError("Expired Token!", 401);
  }

  const token = reqToken.split(" ")[1];

  verify(
    token,
    String(process.env.ACCESS_TOKEN_SECRET),
    (error: VerifyErrors | null, decoded) => {
      if (error) {
        throw new AppError(error.message, 401);
      }

      res.locals.customerDecoded = decoded?.sub;
    }
  );

  return next();
};

import "dotenv/config";
import { Request, Response } from "express";
import { ParamType } from "../../interfaces/customers/customersLogin.types";
import { AppError } from "../../errors/errors";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export const customerRefreshTokenService = async (
  refreshToken: ParamType,
  res: Response,
  req: Request
): Promise<{ message: string }> => {
  if (!refreshToken) {
    throw new AppError("Refresh token is missing!");
  }

  verify(
    String(refreshToken),
    String(process.env.REFRESH_TOKEN_SECRET),
    (err, decoded) => {
      if (err) {
        throw new AppError(err.message, 401);
      }

      const accessToken = sign(
        { email: (decoded as JwtPayload).email },
        String(process.env.ACCESS_TOKEN_SECRET),
        {
          expiresIn: Number(process.env.ACCESS_TOKEN_LIFE),
          subject: String((decoded as JwtPayload).id),
        }
      );

      res.locals.customerDecoded = decoded?.sub;

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.ACCESS_COOKIE_LIFE),
      });
    }
  );

  return { message: "Access token successfully renewed!" };
};

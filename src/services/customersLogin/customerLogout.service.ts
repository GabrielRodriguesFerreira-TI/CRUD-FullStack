import { Response } from "express";

export const customerLogoutService = async (res: Response): Promise<any> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return { message: "Successfully logged out!" };
};

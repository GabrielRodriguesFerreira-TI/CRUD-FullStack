import { Router } from "express";
import * as Customers from "../controllers/customers/index";
import * as Middlewares from "../middlewares/index";
import { validateBodyMiddleware } from "../middlewares";
import { customerLoginSchema } from "../schemas/customers/customersLogin.schemas";

export const customersLoginRoutes: Router = Router();

customersLoginRoutes.post(
  "/login",
  validateBodyMiddleware(customerLoginSchema),
  Customers.customerLoginController
);

customersLoginRoutes.post(
  "/login/token",
  Customers.customerRefreshTokenController
);

customersLoginRoutes.post(
  "/logout",
  Middlewares.tokenValidationMiddleware,
  Customers.customerLogoutController
);

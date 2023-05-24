import { Router } from "express";
import * as Customers from "../controllers/customers/index";
import * as Middlewares from "../middlewares/index";
import { createCustomerSchema } from "../schemas/customers/customers.schemas";

export const customerRoutes: Router = Router();

customerRoutes.post(
  "/customers",
  Middlewares.validateBodyMiddleware(createCustomerSchema),
  Customers.createCustomerController
);

customerRoutes.get(
  "/customers",
  Middlewares.tokenValidationMiddleware,
  Customers.retrieveCustomersController
);

customerRoutes.get(
  "/customers/:customer_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Customers.retrieveOneCustomerController
);

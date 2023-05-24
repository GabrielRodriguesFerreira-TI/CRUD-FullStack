import { Router } from "express";
import * as Customers from "../controllers/customers/index";
import * as Middlewares from "../middlewares/index";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schemas/customers/customers.schemas";

export const customerRoutes: Router = Router();

customerRoutes.post(
  "/customers",
  Middlewares.validateBodyMiddleware(createCustomerSchema),
  Middlewares.validateUniqueRegisterMiddleare,
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

customerRoutes.patch(
  "/customers/:customer_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Middlewares.validateBodyMiddleware(updateCustomerSchema),
  Middlewares.validateUniqueRegisterMiddleare,
  Middlewares.verifyPermissionMiddlewares,
  Customers.updateCustomersController
);

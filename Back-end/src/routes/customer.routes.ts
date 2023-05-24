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

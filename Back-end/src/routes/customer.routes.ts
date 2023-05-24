import { Router } from "express";
import * as Customers from "../controllers/customers/index";

export const customerRoutes: Router = Router();

customerRoutes.post("/customers", Customers.createCustomerController);

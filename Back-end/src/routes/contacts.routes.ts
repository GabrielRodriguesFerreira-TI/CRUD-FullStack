import { Router } from "express";
import * as Middlewares from "../middlewares/index";
import * as Contacts from "../controllers/contacts/index";

export const contactsRoutes: Router = Router();

contactsRoutes.post(
  "/contacts/:customer_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Contacts.createContactsController
);

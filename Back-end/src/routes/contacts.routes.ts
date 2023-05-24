import { Router } from "express";
import * as Middlewares from "../middlewares/index";
import * as Contacts from "../controllers/contacts/index";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contacts/contacts.schemas";

export const contactsRoutes: Router = Router();

contactsRoutes.post(
  "/contacts/:customer_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Middlewares.validateBodyMiddleware(createContactSchema),
  Middlewares.verifyContactMiddleware,
  Contacts.createContactsController
);

contactsRoutes.patch(
  "/contacts/:customer_id/:contact_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Middlewares.verifyPermissionMiddlewares,
  Middlewares.validateBodyMiddleware(updateContactSchema),
  Middlewares.verifyContactMiddleware,
  Contacts.updateContactsController
);

import { Router } from "express";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contacts/contacts.schemas";
import { addContactRateLimit } from "../config/addContactRateLimit.config";
import * as Middlewares from "../middlewares/index";
import * as Contacts from "../controllers/contacts/index";

export const contactsRoutes: Router = Router();

contactsRoutes.post(
  "/contacts/:customer_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Middlewares.validateBodyMiddleware(createContactSchema),
  Middlewares.verifyContactMiddleware,
  addContactRateLimit,
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

contactsRoutes.delete(
  "/contacts/:customer_id/:contact_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Middlewares.verifyPermissionMiddlewares,
  Contacts.deleteContactsController
);

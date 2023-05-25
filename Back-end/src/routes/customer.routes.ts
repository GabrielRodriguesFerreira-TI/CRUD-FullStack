import multer from "multer";
import { Router } from "express";
import * as Customers from "../controllers/customers/index";
import * as Middlewares from "../middlewares/index";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schemas/customers/customers.schemas";
import imageProfileMulter from "../config/imageProfile.multer";

export const customerRoutes: Router = Router();
const upload = multer(imageProfileMulter);

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

customerRoutes.delete(
  "/customers/:customer_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Middlewares.verifyPermissionMiddlewares,
  Customers.deleteCustomersController
);

customerRoutes.patch(
  "/customers/upload/:customer_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Middlewares.verifyPermissionMiddlewares,
  Middlewares.verifyImageProfileMiddlewares,
  upload.single("image"),
  Customers.uploadCustomerProfileImageController
);

customerRoutes.delete(
  "/customers/upload/:filename/:customer_id",
  Middlewares.tokenValidationMiddleware,
  Middlewares.verifyIdExistsMiddlewares,
  Middlewares.verifyPermissionMiddlewares
);

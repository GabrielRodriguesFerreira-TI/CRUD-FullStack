import "express-async-errors";
import express, { Application, json } from "express";
import { customerRoutes } from "./routes/customer.routes";
import { handleErros } from "./errors/errors";
import cookieParser from "cookie-parser";
import { customersLoginRoutes } from "./routes/customerLogin.routes";
import { contactsRoutes } from "./routes/contacts.routes";

const app: Application = express();

app.use(json());
app.use(cookieParser());

app.use("", customerRoutes);
app.use("", customersLoginRoutes);
app.use("", contactsRoutes);

app.use(handleErros);

export default app;

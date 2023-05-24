import express, { Application, json } from "express";
import { customerRoutes } from "./routes/customer.routes";
import { handleErros } from "./errors/errors";

const app: Application = express();

app.use(json());

app.use("", customerRoutes);

app.use(handleErros);

export default app;

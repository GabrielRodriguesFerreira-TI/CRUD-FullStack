import express, { Application, json } from "express";
import { usersRoutes } from "./routes/users.routes";

const app: Application = express();

app.use(json());

app.use("", usersRoutes);

export default app;

import express, { Application, json } from "express";

const app: Application = express();

app.use(json());

app.use("", () => {});

export default app;

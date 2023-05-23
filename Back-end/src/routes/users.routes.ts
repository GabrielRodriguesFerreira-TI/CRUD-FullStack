import { Router } from "express";

export const usersRoutes: Router = Router();

usersRoutes.get("/users", async (req, res) => {
  return res.status(200).json({ message: "Rota inicial" });
});

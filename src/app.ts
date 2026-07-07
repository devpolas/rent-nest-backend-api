import express from "express";
import type { Application, Request, Response } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import globalErrorController from "./middlewares/error";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Rent Nest Ready To Talk",
  });
});

app.use("/api/v1/auth", authRouter);

app.use(globalErrorController);

export default app;

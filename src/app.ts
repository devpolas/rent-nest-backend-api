import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes";
import globalErrorController from "./middlewares/error";
import config from "./config";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.app_urls, credentials: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Rent Nest Ready To Talk",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorController);

export default app;

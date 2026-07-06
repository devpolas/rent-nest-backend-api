import express from "express";
import type { Application, Request, Response } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Rent Nest Ready To Talk",
  });
});

export default app;

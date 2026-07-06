import app from "./app";
import config from "./config";
import prisma from "./lib/prisma";

prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database failed to connect.....💥", err);
  });

const server = app.listen(config.port, () => {
  console.log(`Server is running on PORT ${config.port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection Error :", err);
  console.log("unhandledRejection! shutting done.....💥");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("uncaughtException Error :", err);
  console.log("uncaughtException! shutting done.....💥");
  server.close(() => {
    process.exit(1);
  });
});

import express from "express";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware";
import { AppError } from "./utils/app-error";
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Splitly backend is running",
  });
});

app.get("/test-error", (_req, _res) => {
  throw new Error("Something went wrong");
});

app.get("/test-app-error", (_req, _res) => {
  throw new AppError(
    "This user does not exist",
    404,
    "USER_NOT_FOUND",
  );
});
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
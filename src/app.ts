import express from "express";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware";
import routes from "./routes";
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Splitly backend is running",
  });
});



app.use(routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
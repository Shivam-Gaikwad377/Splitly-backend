import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).json({
        message: "Splitly backend is running",
        success: true
    });
});

export default app;
import { Request, Response, NextFunction } from "express";
import router from "./routes";

const express = require("express");
const app = express();
const dotenv = require("dotenv");

// load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "API is running on /api" });
});

app.use(router);

app.listen(PORT, () =>
  console.log(`REST API server ready at: http://localhost:${PORT}`)
);

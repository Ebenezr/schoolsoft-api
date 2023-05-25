import { Request, Response, NextFunction } from "express";
import router from "./routes";
import cookieParser from "cookie-parser";
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
// load environment variables
dotenv.config();
// setup express
app.use(express.json());
// setup port
const PORT = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "API is running on /api" });
});

// for logging
app.use(morgan("dev"));
// for rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
});
app.use(limiter);

// setup cors
app.use(cors());
// setup routes
app.use(router);
//
app.listen(PORT, () =>
  console.log(`REST API server ready at: http://localhost:${PORT}`)
);
// for handling errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, UPDATE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
  res.status(404);
  return res.json({
    success: false,
    message: `API SAYS: Endpoint not found for path: ${req.path}`,
  });
});

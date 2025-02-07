import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));

//routes

import userRouter from "./routes/user.routes.js";


app.use("/api/users", userRouter);

import errorHandler from "./utils/errorHandler.js";
app.use(errorHandler);

export default app;

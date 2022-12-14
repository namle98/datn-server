import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./src/routes/auth.route";
require("dotenv").config();

//app
const app = express();

//db

mongoose
  .connect(process.env.DATABASE_LOCAL || "")
  .then(() => {
    console.log("DB connected");
  })
  .catch((err: any) => {
    console.log("DB connection err", err);
  });

// middlewares

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//routes mioddleware

app.use("/api", authRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./src/routes/auth.route";
import categoryRouter from "./src/routes/category.route";
import subCategoryRouter from "./src/routes/subCategory.route";
import productRouter from "./src/routes/product.route";
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
app.use("/api", categoryRouter);
app.use("/api", subCategoryRouter);
app.use("/api", productRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));

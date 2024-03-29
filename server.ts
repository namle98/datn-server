import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./src/routes/auth.route";
import categoryRouter from "./src/routes/category.route";
import subCategoryRouter from "./src/routes/subCategory.route";
import productRouter from "./src/routes/product.route";
import cloudinaryRouter from "./src/routes/cloudinary";
import orderRouter from "./src/routes/admin.route";
import stripeRouter from "./src/routes/stripe.route";
import couponRouter from "./src/routes/coupon.route";
import userRouter from "./src/routes/user.route";
require("dotenv").config();

//app
const app = express();

//db

const connectionString = process.env.MONGODB_URI;

if (connectionString) {
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log("DB connected");
    })
    .catch((err: any) => {
      console.log("DB connection err", err);
    });
}

// middlewares

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//routes mioddleware
app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", subCategoryRouter);
app.use("/api", productRouter);
app.use("/api", cloudinaryRouter);
app.use("/api", orderRouter);
app.use("/api", userRouter);
app.use("/api", stripeRouter);
app.use("/api", couponRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

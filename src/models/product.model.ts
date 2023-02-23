const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: String,
      enum: ["Black", "Gray", "Silver", "White", "Yellow"],
    },
    brand: {
      type: String,
      enum: ["Apple", "LG", "Microsoft", "Lenovo", "ASUS"],
    },
    chip: {
      type: String,
      enum: [
        "Core i3",
        "Core i5",
        "Core i7",
        "Core i9",
        "Ryzen 5",
        "Ryzen 7",
        "Ryzen 9",
        "Apple M1",
        "Apple M2",
      ],
    },
    ram: {
      type: String,
      enum: ["8GB", "16GB", "32GB", "64GB"],
    },
    rom: {
      type: String,
      enum: ["128Gb", "256GB", "512Gb", "1TB", "2TB"],
    },
    display: {
      type: String,
      enum: ["13,3 inh", "14 inh", "15.6 inh", "16 inh"],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

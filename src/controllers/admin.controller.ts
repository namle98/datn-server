import { Request, Response } from "express";
const Order = require("../models/order");
const User = require("../models/user.model");
const Product = require("../models/product.model");

module.exports = {
  orders: async function (req: Request, res: Response) {
    let allOrders = await Order.find({})
      .sort("-createdAt")
      .populate("products.product")
      .exec();

    res.json(allOrders);
  },
  ordersCount: async function (req: Request, res: Response) {
    const page = req.params.page;
    const currentPage = parseInt(page) || 1;
    const perPage = 3;
    let allOrders = await Order.find({})
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("products.product")
      .exec();

    res.json(allOrders);
  },
  orderStatus: async function (req: Request, res: Response) {
    const { orderId, orderStatus } = req.body;

    let updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    ).exec();

    if (orderStatus === "Cancelled") {
      let order = await Order.findById(orderId).exec();
      if (order) {
        order.products.forEach(async (element: any) => {
          let products = await Product.findById(element.product).exec();

          await Product.bulkWrite(
            [
              {
                updateOne: {
                  filter: { _id: products._id }, // IMPORTANT item.product
                  update: {
                    $inc: { quantity: +element.count, sold: -element.count },
                  },
                },
              },
            ],
            {}
          );
        });
      }
    }
    res.json(updated);
  },
  getAllUser: async function (req: Request, res: Response) {
    const listUser = await User.find({}).sort({ createdAt: -1 }).exec();
    res.json(listUser);
  },
};

import { Request, Response } from "express";
const Order = require("../models/order");
const User = require("../models/user.model");

module.exports = {
  orders: async function (req: Request, res: Response) {
    let allOrders = await Order.find({})
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

    res.json(updated);
  },
  getAllUser: async function (req: Request, res: Response) {
    const listUser = await User.find({}).sort({ createdAt: -1 }).exec();
    res.json(listUser);
  },
};

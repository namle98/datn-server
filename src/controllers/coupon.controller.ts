import { Request, Response } from "express";
const Coupon = require("../models/coupon");

module.exports = {
  create: async function (req: Request, res: Response) {
    try {
      // console.log(req.body);
      // return;
      const { name, expiry, discount } = req.body.coupon;
      res.json(await new Coupon({ name, expiry, discount }).save());
    } catch (err) {
      console.log(err);
    }
  },
  remove: async function (req: Request, res: Response) {
    try {
      res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec());
    } catch (err) {
      console.log(err);
    }
  },
  list: async function (req: Request, res: Response) {
    try {
      res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
    } catch (err) {
      console.log(err);
    }
  },
};

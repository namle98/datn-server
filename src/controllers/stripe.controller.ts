import { Request, Response } from "express";
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports = {
  createPaymentIntent: async function (req: Request, res: Response) {
    const { couponApplied } = req.body;

    // later apply coupon
    // later calculate price

    // 1 find user
    const user = await User.findOne({ email: req.user.email }).exec();
    // 2 get user cart total
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderdBy: user._id,
    }).exec();
    // console.log("CART TOTAL", cartTotal, "AFTER DIS%", totalAfterDiscount);

    let finalAmount = 0;

    if (couponApplied && totalAfterDiscount) {
      finalAmount = totalAfterDiscount * 100;
    } else {
      finalAmount = cartTotal * 100;
    }

    // create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalAfterDiscount,
      payable: finalAmount,
    });
  },
};

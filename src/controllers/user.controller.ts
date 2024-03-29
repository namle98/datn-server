import { Request, Response } from "express";
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const { v4: uuidv4 } = require("uuid");
import nodeMailer from "nodemailer";
require("dotenv").config();

let mailTransporter = nodeMailer.createTransport({
  service: "gmail",
  // host: "mail.openjavascript.info",
  // secure: true,
  auth: {
    user: "accmycomputershop@gmail.com",
    pass: process.env.PASSMAIL,
  },
});

const msgMail = (orderBy: string) => {
  let detailsMsgMail = {
    from: "accmycomputershop@gmail.com",
    to: "lephuongnam2807@gmail.com",
    subject: "New order",
    html: `<p>There are new orders by ${orderBy}, please visit the link below for details</p> <br/> <a href='https://datn-namlp-client.herokuapp.com/admin/order'>Click here</a>`,
  };
  return detailsMsgMail;
};

const msgMailToUser = (products: any, to: string) => {
  let detailsMsgMailToUser = {
    from: "accmycomputershop@gmail.com",
    to: to,
    subject: "Order Success",
    html: `
      <p>
You have successfully ordered the following products. Thank you for shopping with us.</p>
<br/>
      <table>
      <thead>
        <tr>
          <th style="margin-right: 10px">Image</th>
          <th style="margin-right: 10px">Title</th>
          <th style="margin-right: 10px">Price</th>
          <th style="margin-right: 10px">Brand</th>
          <th style="margin-right: 10px">Color</th>
          <th style="margin-right: 10px">Count</th>
        </tr>
      </thead>

     
        <tbody>
        ${products?.map(
          (p: any) =>
            `
          <tr>
          <td> <img src = ${p.images} style="width:200px; height: 200px; object-fit: cover; padding: 10px;"/> </td>
           <td style="padding: 10px;">${p.title}</td>
            <td style="padding: 10px;">$${p.price}</td> 
            <td style="padding: 10px;">${p.brand}</td>
             <td style="padding: 10px;"> ${p.color} </td>
              <td style="padding: 10px;"> ${p.count} </td>
          </tr>
          `
        )}
          
        </tbody>
  
    </table>`,
  };
  return detailsMsgMailToUser;
};

module.exports = {
  userCart: async function (req: Request, res: Response) {
    const { cart } = req.body;

    let products = [];

    const user = await User.findOne({ email: req.user.email }).exec();

    // check if cart with logged in user id already exist
    let cartExistByThisUser = await Cart.findOne({
      orderdBy: user._id,
    }).exec();

    if (cartExistByThisUser) {
      cartExistByThisUser.remove();
      console.log("removed old cart");
    }

    for (let i = 0; i < cart.length; i++) {
      let object: any = {};

      object.product = cart[i]._id;
      object.images = cart[i].images[0].url;
      object.title = cart[i].title;
      object.brand = cart[i].brand;
      object.count = cart[i].count;
      object.color = cart[i].color;
      // get price for creating total
      let productFromDb = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = productFromDb.price;

      products.push(object);
    }

    // console.log('products', products)

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    // console.log("cartTotal", cartTotal);

    let newCart = await new Cart({
      products,
      cartTotal,
      orderdBy: user._id,
    }).save();

    console.log("new cart ----> ", newCart);
    res.json({ ok: true });
  },
  getUserCart: async function (req: Request, res: Response) {
    const user = await User.findOne({ email: req.user.email }).exec();

    let cart = await Cart.findOne({ orderdBy: user._id })
      .populate("products.product", "_id title price totalAfterDiscount")
      .exec();

    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });
  },
  emptyCart: async function (req: Request, res: Response) {
    const user = await User.findOne({ email: req.user.email }).exec();

    const cart = await Cart.findOneAndRemove({ orderdBy: user._id }).exec();
    res.json(cart);
  },
  saveAddress: async function (req: Request, res: Response) {
    const userAddress = await User.findOneAndUpdate(
      { email: req.user.email },
      { address: req.body.address, phone: req.body.phone }
    ).exec();

    res.json({ ok: true });
  },
  applyCouponToUserCart: async function (req: Request, res: Response) {
    const { coupon } = req.body;
    console.log("COUPON", coupon);

    const validCoupon = await Coupon.findOne({ name: coupon }).exec();
    if (validCoupon === null) {
      return res.json({
        err: "Invalid coupon",
      });
    }
    console.log("VALID COUPON", validCoupon);

    const user = await User.findOne({ email: req.user.email }).exec();

    let { products, cartTotal } = await Cart.findOne({ orderdBy: user._id })
      .populate("products.product", "_id title price")
      .exec();

    console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

    // calculate the total after discount
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2); // 99.99

    console.log("----------> ", totalAfterDiscount);

    Cart.findOneAndUpdate(
      { orderdBy: user._id },
      { totalAfterDiscount },
      { new: true }
    ).exec();

    res.json(totalAfterDiscount);
  },
  createOrder: async function (req: Request, res: Response) {
    const { paymentIntent } = req.body.stripeResponse;
    const { phone, address } = req.body;

    const user = await User.findOne({ email: req.user.email }).exec();

    let { products } = await Cart.findOne({ orderdBy: user._id }).exec();

    let newOrder = await new Order({
      products,
      paymentIntent,
      orderdBy: user._id,
      phone: phone,
      address,
      orderdByName: user.name,
    }).save();

    mailTransporter.sendMail(
      msgMailToUser(products, req.user.email),
      (err: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log("send mail to user successfully");
        }
      }
    );

    mailTransporter.sendMail(msgMail(user.name), (err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log("send mail successfully");
      }
    });

    // decrement quantity, increment sold
    let bulkOption = products.map((item: any) => {
      return {
        updateOne: {
          filter: { _id: item.product._id }, // IMPORTANT item.product
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

    console.log("NEW ORDER SAVED", newOrder);
    res.json({ ok: true });
  },
  orders: async function (req: Request, res: Response) {
    let user = await User.findOne({ email: req.user.email }).exec();

    let userOrders = await Order.find({ orderdBy: user._id })
      .sort("-createdAt")
      .populate("products.product")
      .exec();

    res.json(userOrders);
  },

  ordersCount: async function (req: Request, res: Response) {
    const page = req.params.page;
    const currentPage = parseInt(page) || 1;
    const perPage = 3;

    let user = await User.findOne({ email: req.user.email }).exec();

    let userOrders = await Order.find({ orderdBy: user._id })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort("-createdAt")
      .populate("products.product")
      .exec();

    res.json(userOrders);
  },

  addToWishlist: async function (req: Request, res: Response) {
    const { productId } = req.body;

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $addToSet: { wishlist: productId } }
    ).exec();

    res.json({ ok: true });
  },
  wishlist: async function (req: Request, res: Response) {
    const list = await User.findOne({ email: req.user.email })
      .select("wishlist")
      .populate("wishlist")
      .exec();

    res.json(list);
  },
  removeFromWishlist: async function (req: Request, res: Response) {
    const { productId } = req.params;
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { wishlist: productId } }
    ).exec();

    res.json({ ok: true });
  },
  createCashOrder: async function (req: Request, res: Response) {
    const { COD, couponApplied, phone, address } = req.body;
    // if COD is true, create order with status of Cash On Delivery

    if (!COD) return res.status(400).send("Create cash order failed");

    const user = await User.findOne({ email: req.user.email }).exec();

    let userCart = await Cart.findOne({ orderdBy: user._id }).exec();

    let finalAmount = 0;

    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
    }
    const createdPayment = Date.now() / 1000;

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uuidv4(),
        amount: finalAmount,
        currency: "usd",
        status: "Cash On Delivery",
        created: parseInt(createdPayment.toString(), 10),
        payment_method_types: ["cash"],
      },
      orderdBy: user._id,
      orderStatus: "Cash On Delivery",
      phone: phone,
      address: address,
      orderdByName: user.name,
    }).save();

    mailTransporter.sendMail(
      msgMailToUser(userCart.products, req.user.email),
      (err: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log("send mail to user successfully");
        }
      }
    );

    mailTransporter.sendMail(msgMail(user.name), (err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log("send mail successfully");
      }
    });

    // decrement quantity, increment sold
    let bulkOption = userCart.products.map((item: any) => {
      return {
        updateOne: {
          filter: { _id: item.product._id }, // IMPORTANT item.product
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

    console.log("NEW ORDER SAVED", newOrder);
    res.json({ ok: true });
  },
};

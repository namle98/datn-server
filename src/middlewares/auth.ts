import { NextFunction, Request, Response } from "express";

const admin = require("../firebase");
const User = require("../models/user.model");

module.exports = {
  authCheck: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
      req.user = firebaseUser;
      next();
    } catch (error) {
      res.status(401).json({
        status: 401,
        err: "Invalid or expired token",
      });
    }
  },
  adminCheck: async function (req: Request, res: Response, next: NextFunction) {
    const email = req?.user?.email;
    const adminUser = await User.findOne({ email }).exec();
    if (adminUser?.role !== "admin") {
      res.status(403).json({
        err: "Admin resource. Access denied.",
      });
    } else {
      next();
    }
  },
};

import { NextFunction, Request, Response } from "express";

const admin = require("../firebase");

module.exports = {
  authCheck: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
      req.user = firebaseUser;
    } catch (error) {
      res.status(401).json({
        err: "Invalid or expired token",
      });
    }
    next();
  },
};

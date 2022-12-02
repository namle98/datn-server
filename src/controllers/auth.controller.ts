import { Request, Response } from "express";
const User = require("../models/user.model");

module.exports = {
  createOrUpdateUser: async function (req: Request, res: Response) {
    const { name, picture, email } = req.user;
    const user = await User.findOneAndUpdate(
      { email },
      { name, picture },
      { new: true }
    );
    if (user) {
      console.log("user updated", user);
      res.json(user);
    } else {
      const newUser = await new User({
        email,
        name,
        picture,
      }).save();
      console.log("user created", newUser);
      res.json(newUser);
    }
  },
  currentUser: async function (req: Request, res: Response) {
    User.findOne({ email: req.user.email }).exec((err: any, user: any) => {
      if (err) throw new Error(err);
      res.json(user);
    });
  },
};

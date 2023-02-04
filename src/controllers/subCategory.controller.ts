import { Request, Response } from "express";

const Sub = require("../models/subCategory");
// const Product = require("../models/product");
const slugify = require("slugify");

module.exports = {
  create: async function (req: Request, res: Response) {
    try {
      const { name, parent } = req.body;
      res.json(await new Sub({ name, parent, slug: slugify(name) }).save());
    } catch (err) {
      console.log("SUB CREATE ERR ----->", err);
      res.status(400).send("Create sub failed");
    }
  },
  list: async function (req: Request, res: Response) {
    res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());
  },
  read: async function (req: Request, res: Response) {
    let sub = await Sub.findOne({ slug: req.params.slug }).exec();
    res.json(sub);
  },
  update: async function (req: Request, res: Response) {
    const { name, parent } = req.body;
    try {
      const updated = await Sub.findOneAndUpdate(
        { slug: req.params.slug },
        { name, parent, slug: slugify(name) },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(400).send("Sub update failed");
    }
  },
  remove: async function (req: Request, res: Response) {
    try {
      const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
      res.json(deleted);
    } catch (err) {
      res.status(400).send("Sub delete failed");
    }
  },
};

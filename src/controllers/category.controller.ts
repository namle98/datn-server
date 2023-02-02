import { Request, Response } from "express";
const Category = require("../models/category.model");
const slugify = require("slugify");

module.exports = {
  create: async function (req: Request, res: Response) {
    try {
      const { name } = req.body;
      const category = await new Category({ name, slug: slugify(name) }).save();
      res.json(category);
    } catch (error) {
      res.status(400).send("Create category failed");
    }
  },
  list: async function (req: Request, res: Response) {
    const listCategories = await Category.find({})
      .sort({ createdAt: -1 })
      .exec();
    res.json(listCategories);
  },
  read: async function (req: Request, res: Response) {
    let category = await Category.find({ slug: req.params.slug }).exec();
    res.json(category);
  },
  update: async function (req: Request, res: Response) {
    const { name } = req.body;
    try {
      const updatedItem = await Category.findOneAndUpdate(
        { slug: req.params.slug },
        { name, slug: slugify(name) },
        { new: true }
      );
      res.json(updatedItem);
    } catch (error) {
      res.status(400).send("Update category failed");
    }
  },
  remove: async function (req: Request, res: Response) {
    try {
      const item = await Category.findOneAndDelete({ slug: req.params.slug });
      res.json(item);
    } catch (error) {
      res.status(400).send("Delete category failed");
    }
  },
};

import { Request, Response } from "express";

const Product = require("../models/product.model");
const User = require("../models/user.model");
const slugify = require("slugify");

const handleQuery = async (req: Request, res: Response, query: any) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();
  res.json(products);
};

const handlePrice = async (req: Request, res: Response, price: any) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("ratings.postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req: Request, res: Response, category: any) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("ratings.postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleStar = (req: Request, res: Response, stars: any) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        // title: "$title",
        floorAverage: {
          $floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err: any, aggregates: any) => {
      if (err) console.log("AGGREGATE ERROR", err);
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("ratings.postedBy", "_id name")
        .exec((err: any, products: any) => {
          if (err) console.log("PRODUCT AGGREGATE ERROR", err);
          res.json(products);
        });
    });
};

const handleSub = async (req: Request, res: Response, sub: any) => {
  const products = await Product.find({ subs: sub })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleShipping = async (req: Request, res: Response, shipping: any) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleColor = async (req: Request, res: Response, color: any) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleBrand = async (req: Request, res: Response, brand: any) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();

  res.json(products);
};
const handleChip = async (req: Request, res: Response, chip: any) => {
  const products = await Product.find({ chip })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();

  res.json(products);
};
const handleDisplay = async (req: Request, res: Response, display: any) => {
  const products = await Product.find({ display })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();

  res.json(products);
};
const handleRam = async (req: Request, res: Response, ram: any) => {
  const products = await Product.find({ ram })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();

  res.json(products);
};
const handleRom = async (req: Request, res: Response, rom: any) => {
  const products = await Product.find({ rom })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings.postedBy", "_id name")
    .exec();

  res.json(products);
};

module.exports = {
  create: async function (req: Request, res: Response) {
    try {
      console.log(req.body);
      req.body.slug = slugify(req.body.title);
      const newProduct = await new Product(req.body).save();
      res.json(newProduct);
    } catch (err: any) {
      console.log(err);
      // res.status(400).send("Create product failed");
      res.status(400).json({
        err: err.message,
      });
    }
  },
  listAll: async function (req: Request, res: Response) {
    const page = req.params.page;
    const currentPage = parseInt(page) || 1;
    const perPage = 12; // 3
    let products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(products);
  },
  getsAll: async function (req: Request, res: Response) {
    let products = await Product.find({})
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(products);
  },
  remove: async function (req: Request, res: Response) {
    try {
      const deleted = await Product.findOneAndRemove({
        slug: req.params.slug,
      }).exec();
      res.json(deleted);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Product delete failed");
    }
  },
  read: async function (req: Request, res: Response) {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("subs")
      .exec();
    res.json(product);
  },
  update: async function (req: Request, res: Response) {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updated = await Product.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true }
      ).exec();
      res.json(updated);
    } catch (err: any) {
      console.log("PRODUCT UPDATE ERROR ----> ", err);
      // return res.status(400).send("Product update failed");
      res.status(400).json({
        err: err.message,
      });
    }
  },

  list: async function (req: Request, res: Response) {
    // console.table(req.body);
    try {
      // createdAt/updatedAt, desc/asc, 3
      const { sort, order, page } = req.body;
      const currentPage = page || 1;
      const perPage = 3; // 3

      const products = await Product.find({})
        .skip((currentPage - 1) * perPage)
        .populate("category")
        .populate("subs")
        .sort([[sort, order]])
        .limit(perPage)
        .exec();

      res.json(products);
    } catch (err) {
      console.log(err);
    }
  },
  productsCount: async function (req: Request, res: Response) {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
  },
  productStar: async function (req: Request, res: Response) {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings?.find(
      (ele: any) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { "ratings.$.star": star } },
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
  },
  listRelated: async function (req: Request, res: Response) {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate("category")
      .populate("subs")
      .populate("ratings.postedBy")
      .exec();

    res.json(related);
  },
  searchFilters: async function (req: Request, res: Response) {
    const {
      query,
      price,
      category,
      stars,
      sub,
      shipping,
      color,
      brand,
      chip,
      ram,
      rom,
      display,
    } = req.body;

    if (query) {
      console.log("query --->", query);
      await handleQuery(req, res, query);
    }

    // price [20, 200]
    if (price !== undefined) {
      console.log("price ---> ", price);
      await handlePrice(req, res, price);
    }

    if (category) {
      console.log("category ---> ", category);
      await handleCategory(req, res, category);
    }

    if (stars) {
      console.log("stars ---> ", stars);
      await handleStar(req, res, stars);
    }

    if (sub) {
      console.log("sub ---> ", sub);
      await handleSub(req, res, sub);
    }

    if (shipping) {
      console.log("shipping ---> ", shipping);
      await handleShipping(req, res, shipping);
    }

    if (color) {
      console.log("color ---> ", color);
      await handleColor(req, res, color);
    }

    if (brand) {
      console.log("brand ---> ", brand);
      await handleBrand(req, res, brand);
    }
    if (chip) {
      console.log("chip ---> ", chip);
      await handleChip(req, res, chip);
    }
    if (display) {
      console.log("display ---> ", display);
      await handleDisplay(req, res, display);
    }
    if (ram) {
      console.log("ram ---> ", ram);
      await handleRam(req, res, ram);
    }
    if (rom) {
      console.log("rom ---> ", rom);
      await handleRom(req, res, rom);
    }
  },
};

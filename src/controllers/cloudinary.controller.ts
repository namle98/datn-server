import { Request, Response } from "express";
require("dotenv").config();

const cloudinary = require("cloudinary").v2;
// CLOUDINARY_CLOUD_NAME = "dwctc1pby";
// CLOUDINARY_API_KEY = "928287259348438";
// CLOUDINARY_API_SECRET = "bUMA3meKtkSeYNsE6ECZOqBjyKM";
// // config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = {
  upload: async function (req: Request, res: Response) {
    try {
      let result = await cloudinary.uploader.upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: "auto", // jpeg, png
      });
      res.json({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (err) {
      console.log(err);
    }
  },
  remove: async function (req: Request, res: Response) {
    try {
      let image_id = req.body.public_id;

      cloudinary.uploader.destroy(image_id, (err: any, result: any) => {
        if (err) return res.json({ success: false, err });
        res.send("ok");
      });
    } catch (error) {
      console.log(error);
    }
  },
};

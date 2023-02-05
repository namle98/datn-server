import { Router } from "express";
const router = Router();
// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const { upload, remove } = require("../controllers/cloudinary.controller");

router.post("/uploadimages", authCheck, adminCheck, upload);
router.post("/removeimage", authCheck, adminCheck, remove);

export default router;

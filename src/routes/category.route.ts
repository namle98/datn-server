import { Router } from "express";
const {
  create,
  read,
  update,
  remove,
  list,
  getSubs,
} = require("../controllers/category.controller");

const router = Router();
//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.get("/category/subs/:_id", getSubs);

export default router;

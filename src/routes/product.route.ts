import { Router } from "express";
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
  getsAll,
} = require("../controllers/product.controller");
const router = Router();
//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productsCount);

router.get("/products/:page", listAll); // products/100
router.get("/products", getsAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);

router.post("/products", list);
// // rating
router.put("/product/star/:productId", authCheck, productStar);
// // related
router.get("/product/related/:productId", listRelated);
// search
router.post("/search/filters", searchFilters);

export default router;

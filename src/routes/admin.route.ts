import { Router } from "express";
const {
  orders,
  orderStatus,
  getAllUser,
} = require("../controllers/admin.controller");

const router = Router();

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

router.get("/admin/orders", authCheck, adminCheck, orders);
router.get("/admin/users", authCheck, adminCheck, getAllUser);
router.put("/admin/order-status", authCheck, adminCheck, orderStatus);

export default router;

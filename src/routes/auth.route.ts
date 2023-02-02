import { Router } from "express";
const {
  createOrUpdateUser,
  currentUser,
} = require("../controllers/auth.controller");

const router = Router();
//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);

export default router;

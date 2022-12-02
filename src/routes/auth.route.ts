import { Router } from "express";
const {
  createOrUpdateUser,
  currentUser,
} = require("../controllers/auth.controller");

const router = Router();
//middlewares
const { authCheck } = require("../middlewares/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);

export default router;

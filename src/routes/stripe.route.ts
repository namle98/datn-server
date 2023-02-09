import { Router } from "express";
const router = Router();

const { createPaymentIntent } = require("../controllers/stripe.controller");
// middleware
const { authCheck } = require("../middlewares/auth");

router.post("/create-payment-intent", authCheck, createPaymentIntent);

export default router;

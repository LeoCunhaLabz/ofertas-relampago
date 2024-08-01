import express from "express";
import { seeOffers, payment, webhook } from "../controllers/checkout.js";

const router = express.Router();

router.get("/offers/:checkoutId", seeOffers);
router.post("/payment/:checkoutId", payment);
router.post("/webhook", webhook);

export default router
import express from "express";
import { seeOffers, payment } from "../controllers/checkout.js";

const router = express.Router();

router.get("/offers/:checkoutId", seeOffers);
router.post("/payment/:checkoutId", payment);

export default router
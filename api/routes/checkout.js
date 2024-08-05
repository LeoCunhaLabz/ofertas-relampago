import express from "express";
import { seeOffers, payment, retrieve } from "../controllers/checkout.js";

const router = express.Router();

router.get("/offers/:checkoutId", seeOffers);
router.post("/payment/:checkoutId", payment);
router.post("/retrieve", retrieve);

export default router
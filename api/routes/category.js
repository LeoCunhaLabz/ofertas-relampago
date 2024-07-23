import express from "express";
import { categoryAdd, categoryRemove, categorySee } from "../controllers/category.js";

const router = express.Router();

router.post("/add", categoryAdd);
router.delete("/remove", categoryRemove);
router.get("/see", categorySee);

export default router
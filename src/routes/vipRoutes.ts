import express from "express";
import { getVIPContent } from "../controllers/adminController";
import { requireVIP } from "../middleware/vipMiddleware";

const router = express.Router();

// VIP users can fetch VIP content
router.get("/content", requireVIP, getVIPContent);

export default router;

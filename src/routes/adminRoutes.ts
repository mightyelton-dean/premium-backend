import express from "express";
import {
  postExpertTip,
  postVIPContent,
  getExpertTips,
  getVIPContent,
  deleteExpertTip,
  deleteVIPContent,
  updateExpertTip,
  updateVIPContent,
} from "../controllers/adminController";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

// Admin-only endpoints
router.post("/expert-tips", adminMiddleware, postExpertTip);
router.post("/vip-content", adminMiddleware, postVIPContent);
router.delete("/expert-tips/:id", adminMiddleware, deleteExpertTip);
router.delete("/vip-content/:id", adminMiddleware, deleteVIPContent);
router.put("/expert-tips/:id", adminMiddleware, updateExpertTip);
router.put("/vip-content/:id", adminMiddleware, updateVIPContent);

// Public and admin fetch endpoints
router.get("/expert-tips", getExpertTips); // Public fetch
router.get("/vip-content", adminMiddleware, getVIPContent); // Admin fetch (can also be protected by VIP middleware for users)

export default router;

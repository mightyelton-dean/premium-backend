import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import paymentRoutes from "./paymentRoutes";
import vipRoutes from "./vipRoutes";
import adminRoutes from "./adminRoutes";
import AuthController from "../controllers/authController";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));
router.use("/auth", authRoutes);
router.use("/users", AuthController.protect, userRoutes);
router.use("/payment", paymentRoutes);
router.use("/vip", AuthController.protect, vipRoutes);
router.use("/admin", adminRoutes);

export default router;

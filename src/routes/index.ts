import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import AuthController from "../controllers/authController";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));
router.use("/auth", authRoutes);
router.use("/users", AuthController.protect, userRoutes);

export default router;
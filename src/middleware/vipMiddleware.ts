import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

// Middleware to check if user is authenticated and is a VIP
export const requireVIP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // You should have authentication middleware that sets req.user
  // For demo, we'll check req.user and look up VIP status
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = await User.findById(req.user.id);
  if (!user || !user.vip) {
    return res.status(403).json({ message: "VIP access required" });
  }
  next();
};

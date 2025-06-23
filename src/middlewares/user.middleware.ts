import { Request, Response, NextFunction } from "express";

export const validateUser = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next();
};

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.id || isNaN(Number(req.params.id))) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  return next();
};

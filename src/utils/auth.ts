import { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_EXPIRES_IN } from "../config";

export const createSendToken = (
  user: any,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // edit as needed
    sameSite: "strict" as const, // edit as needed
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, // edit in config or .env
  });
};
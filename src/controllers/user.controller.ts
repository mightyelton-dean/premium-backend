import { Request, Response } from "express";

export const getAllUsers = (_req: Request, res: Response) => {
  // Dummy implementation
  res.json([{ id: 1, name: "Test User" }]);
};

export const getUserById = (req: Request, res: Response) => {
  // Dummy implementation
  res.json({ id: req.params.id, name: "Test User" });
};

export const createUser = (req: Request, res: Response) => {
  // Dummy implementation
  res.status(201).json({ id: 2, ...req.body });
};

export const updateUser = (req: Request, res: Response) => {
  // Dummy implementation
  res.json({ id: req.params.id, ...req.body });
};

export const deleteUser = (_req: Request, res: Response) => {
  // Dummy implementation
  res.status(204).send();
};

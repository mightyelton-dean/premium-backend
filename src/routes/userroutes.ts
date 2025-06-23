import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { validateUser, validateUserId } from "../middlewares/user.middleware";

const router = Router();

// GET /users - Get all users
router.get("/", getAllUsers);

// GET /users/:id - Get a single user by ID
router.get("/:id", validateUserId, getUserById);

// POST /users - Create a new user
router.post("/", validateUser, createUser);

// PUT /users/:id - Update an existing user
router.put("/:id", validateUserId, validateUser, updateUser);

// DELETE /users/:id - Delete a user
router.delete("/:id", validateUserId, deleteUser);

export default router;

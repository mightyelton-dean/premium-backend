import express from "express";
import AuthController from "../controllers/authController";
// @ts-ignore
const { body } = require("express-validator");

const router = express.Router();

// Signup route
router.post(
  "/signup",
  [
    body("username").trim().notEmpty().isLength({ min: 3, max: 20 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("passwordConfirm").custom((value: any, { req }: any) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
    body("phone").optional().isMobilePhone("any"),
    body("fullName").optional().isString().isLength({ min: 1, max: 100 }),
    body("dateOfBirth").optional().isISO8601(),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("address.street").optional().isString(),
    body("address.city").optional().isString(),
    body("address.state").optional().isString(),
    body("address.country").optional().isString(),
    body("address.postalCode").optional().isString(),
    body("profilePicture").optional().isString(),
    body("bio").optional().isString(),
    body("socialLinks.facebook").optional().isURL(),
    body("socialLinks.twitter").optional().isURL(),
    body("socialLinks.linkedin").optional().isURL(),
    body("socialLinks.instagram").optional().isURL(),
  ],
  AuthController.signup
);

// Login route
router.post(
  "/login",
  [body("username").trim().notEmpty(), body("password").notEmpty()],
  AuthController.login
);

// Profile update route
router.put(
  "/profile",
  [
    // Add relevant validation here
    body("fullName").optional().isString().isLength({ min: 1, max: 100 }),
    body("phone").optional().isMobilePhone("any"),
    body("dateOfBirth").optional().isISO8601(),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("address.street").optional().isString(),
    body("address.city").optional().isString(),
    body("address.state").optional().isString(),
    body("address.country").optional().isString(),
    body("address.postalCode").optional().isString(),
    body("profilePicture").optional().isString(),
    body("bio").optional().isString(),
    body("socialLinks.facebook").optional().isURL(),
    body("socialLinks.twitter").optional().isURL(),
    body("socialLinks.linkedin").optional().isURL(),
    body("socialLinks.instagram").optional().isURL(),
  ],
  AuthController.updateProfile
);

// Password reset request route
router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail()],
  AuthController.forgotPassword
);

// Password reset route
router.post(
  "/reset-password/:token",
  [
    body("password").isLength({ min: 8 }),
    body("passwordConfirm").custom((value: any, { req }: any) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  AuthController.resetPassword
);

// Change password when logged in
router.post(
  "/change-password",
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 8 }),
    body("passwordConfirm").custom((value: any, { req }: any) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),
  ],
  AuthController.changePassword
);

export default router;

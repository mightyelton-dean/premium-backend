import { Request, Response, NextFunction } from "express";
// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: any;
}
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { createSendToken } from "../utils/auth";
import AppError from "../utils/appError";
import { JWT_SECRET } from "../config/index";

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, passwordConfirm } = req.body;

      if (password !== passwordConfirm) {
        return next(new AppError("Passwords do not match", 400));
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return next(
          new AppError("User already exists with that email or username", 400)
        );
      }

      const newUser = await User.create({
        ...req.body, // now supports new fields like phone, fullName, etc.
        role: req.body.role || "user",
      });

      createSendToken(newUser, 201, res);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return next(new AppError("Please provide username and password", 400));
      }

      const user = await User.findOne({ username }).select("+password");
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError("Incorrect username or password", 401));
      }

      createSendToken(user, 200, res);
    } catch (err) {
      next(err);
    }
  }

  async protect(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    try {
      let token;
      if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401
          )
        );
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token no longer exists.",
            401
          )
        );
      }

      req.user = currentUser;
      next();
    } catch (err) {
      next(err);
    }
  }

  restrictTo(...roles: string[]) {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
      next();
    };
  }

  // NEW METHODS

  // Update profile
  async updateProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Only allow updating certain fields
      const allowedFields = [
        "fullName",
        "phone",
        "dateOfBirth",
        "gender",
        "address",
        "profilePicture",
        "bio",
        "socialLinks",
      ];
      const updates: any = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });

      const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        status: "success",
        data: { user: updatedUser },
      });
    } catch (err) {
      next(err);
    }
  }

  // Forgot password (send reset token)
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new AppError("There is no user with that email", 404));
      }

      // Generate a reset token (simple version, use crypto in production)
      const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "10m",
      });
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // FIXED: assign Date, not number
      await user.save({ validateBeforeSave: false });

      // TODO: Send resetToken to user's email (implement mailing)
      // For now, just return token in response
      res.status(200).json({
        status: "success",
        message: "Password reset token sent to email",
        resetToken,
      });
    } catch (err) {
      next(err);
    }
  }

  // Reset password with token
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.params.token;
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      const user = await User.findOne({
        _id: decoded.id,
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (!user) {
        return next(new AppError("Token is invalid or has expired", 400));
      }

      const { password, passwordConfirm } = req.body;
      if (password !== passwordConfirm) {
        return next(new AppError("Passwords do not match", 400));
      }

      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      createSendToken(user, 200, res);
    } catch (err) {
      next(err);
    }
  }

  // Change password (when logged in)
  async changePassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await User.findById(req.user._id).select("+password");
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const { currentPassword, newPassword, passwordConfirm } = req.body;
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        return next(new AppError("Current password is incorrect", 401));
      }
      if (newPassword !== passwordConfirm) {
        return next(
          new AppError("Password confirmation does not match new password", 400)
        );
      }

      user.password = newPassword;
      await user.save();

      createSendToken(user, 200, res);
    } catch (err) {
      next(err);
    }
  }

  // Add this method to update VIP status after payment
  async setVIP(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return next(new AppError("Not authenticated", 401));
      req.user.vip = true;
      await req.user.save();
      res.status(200).json({ message: "VIP status activated" });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();

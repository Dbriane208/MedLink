import e, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../prisma/PrismaClient";
import AppError from "../utils/AppError";
import { sendPasswordResetEmail } from "../utils/MailConfig";

/**
 * Registers a new user.
 * - Accepts user details from the request body.
 * - Hashes the password before storing it.
 * - Creates the user in the database with Prisma.
 * - Generates a JWT token for the registered user.
 */

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;

    delete req.body.confirmPassword;

    const hashedPassword = await bcrypt.hash(password, 15);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      },
    });

    if (!user) {
      return next(new AppError("User not created", 500));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token: token,
      data: user,
    });
  } catch (err) {
    return next(new AppError("Error creating user", 500));
  }
};

/**
 * Logs in an existing user.
 * - Retrieves the user based on the email provided in the request body.
 * - Verifies the password.
 * - Generates a JWT token for the authenticated user.
 */

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        password: true,
        role: true,
        id: true,
      },
    });

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Oops! You entered the wrong password", 401));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });

    res.status(200).json({
      status: "success",
      message: "Logged in Successfully",
      token: token,
      data: {
        name: user.name,
        role: user.role,
        id: user.id,
        loggedInAt: new Date(),
      },
    });
  } catch (err) {
    return next(new AppError("Error logging in the user", 500));
  }
};

/**
 * Initiates the password reset process for a user.
 * - Verifies the user's email.
 * - Generates a reset token, hashes it, and saves it to the user’s record with an expiration.
 * - Sends the reset token to the user's email.
 */

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return next(new AppError("User with this email does not exist", 404));
    }

    const resetToken = crypto.randomBytes(4).toString("hex");

    const hashedPassword = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); 

    await prisma.user.update({
      where: { email: email },
      data: {
        resetToken: hashedPassword,
        resetTokenExpires: resetTokenExpires,
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    return next(
      new AppError("Error sending reset email. Try again later", 500)
    );
  }
};

/**
 * Resets the user's password.
 * - Verifies the reset token against the stored hash and checks expiration.
 * - Hashes and updates the new password.
 * - Clears the reset token fields after the password reset.
 */

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    const newtoken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });

    res.status(200).json({
      status: "success",
      token: newtoken,
      message: "Password reset successful",
    });
  } catch (err) {
    return next(new AppError("Password reset failed", 500));
  }
};

/**
 * Updates the user's password.
 * - Verifies the current password.
 * - Hashes and saves the new password.
 */

export const updatePassword = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      }
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { password, newPassword } = req.body;

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return next(new AppError("Your current password is wrong", 401));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error updating password", 500));
  }
};

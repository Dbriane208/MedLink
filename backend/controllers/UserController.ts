import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/PrismaClient";
import AppError from "../utils/AppError";

/**
 * Retrieves all users from the database.
 * 
 * This function fetches all users from the database and returns them in the response.
 * If no users are found, it returns an error.
 */

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany();

        if(!users) {
            return next(new AppError("There is no users found", 404));
        }

        res.status(200).json({
            status: "success",
            message: "All users fetched successfully",
            data: users
        });

    } catch (err) {
        return next(new AppError("Error getting users", 500));
    }
}

/**
 * Retrieves a user by their ID.
 * 
 * This function fetches a specific user based on the provided ID. If the user is found,
 * it returns the user's details in the response, excluding sensitive fields like password.
 * If the user does not exist, an error is returned.
 */

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id)},
            select: {
                name: true,
                email: true,
                role: true,
                appointments: true,
                prescriptions: true,
                createdAt: true
            }
        });

        if(!user) {
            return next(new AppError("User with that Id not found", 404));
        }

        res.status(200).json({
            status: "success",
            message: "User fetched successfully",
            data: user
        });

    } catch (err) {
        return next(new AppError("Error getting user with this Id", 500));
    }
}

/**
 * Updates a user's name and/or email by their ID.
 * 
 * This function allows partial updates to a user's name and/or email fields. It validates
 * that the user exists and checks that the provided email (if updated) is unique. If
 * successful, it updates the user information in the database.
 */

export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email} = req.body;
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({ where: { id: userId }});

        if(!user) {
            return next(new AppError("User not found", 404));
        }

        if(email) {
            const mail = await prisma.user.findFirst({ where: { email: email}})
            if(mail && mail.id !== userId) {
                return next(new AppError("Email entered already exists with another user", 409));
            }
        }

        const updateData: {name?: string, email?: string} = {};
        if(name) updateData.name = name;
        if(email) updateData.email = email;

        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: updateData
        });

        res.status(200).json({
            status: 'success',
            message: "User details updated successfully",
            data: updateUser
        });

    } catch (err) {
        console.log(err);
        return next(new AppError("Error updating user details", 500));
    }
}

/**
 * Deletes a user by their ID.
 * 
 * This function deletes a user from the database based on the provided ID. If the
 * user does not exist, an error is returned. Upon successful deletion, a success
 * message is sent in the response.
 */

export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);

        if(!userId) {
            return next(new AppError("User does not exist", 404));
        }

        await prisma.user.delete({
            where: { id: userId}
        });

        res.status(200).json({
            status: "success",
            message: "User deleted successfully",
        });

    } catch (err) {
        return next(new AppError("Error deleting user", 500));
    }
}

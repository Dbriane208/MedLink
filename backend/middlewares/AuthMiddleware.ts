import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/PrismaClient";
import jwt from 'jsonwebtoken';
import AppError from "../utils/AppError";

/**
 * Middleware to protect routes by verifying user authentication.
 * - Checks if a valid JWT token is present in the authorization header.
 * - Verifies the token and decodes it to retrieve the user ID.
 * - Fetches the user from the database based on the decoded token's user ID.
 * - Assigns the authenticated user to the request object.
 * - Proceeds to the next middleware if the user is successfully authenticated.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */

export const protect = async (req: any, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        // Accessing the token from the request authorization header
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return next(new AppError('You are not logged in', 401));
        }

        // Verifying the user token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

        if(!decoded) {
          return next(new AppError('Token does not match', 401));  
        }

        // Fetching the user with a matching ID from the decoded token
        const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });

        if(!currentUser) {
            return next(new AppError('CurrentUser not found', 404));
        }

        // Assign the current user to the request object
        req.user = currentUser;

        next();

    } catch (err) {
        return next(new AppError('Headers authorization failed', 401));
    }
}

/**
 * Middleware to restrict access to specific roles.
 * - Accepts a list of allowed roles as arguments.
 * - Checks if the authenticated user has a role included in the allowed roles list.
 * - Denies access if the user's role is not authorized for the route.
 * - Proceeds to the next middleware if the user's role is authorized.
 * 
 * @param {...string[]} roles - Array of allowed user roles for the route.
 * @returns {Function} Middleware function that restricts access based on user role.
 */

export const restrictTo = function(...roles: string[]) {
    return (req: any, res: Response, next: NextFunction) => {
        if(!req.user || !roles.includes(req.user.role!)) {
            return next(new AppError("You do not have permission to access this route", 403));
        }

        next();
    }
}

/**
 * Interface to represent the decoded token structure.
 * - Used to define the structure of JWT decoded data, specifically the user ID.
 */

export interface DecodedToken {
    id: number;
}

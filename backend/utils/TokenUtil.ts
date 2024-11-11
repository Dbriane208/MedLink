import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import AppError from "./AppError";

export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
    let token : string | undefined;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError("You are not logged in", 401));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        req.userId = decodedToken.id; 
        next();

    } catch (err) {
        return next(new AppError("Invalid or expired token", 401));
    }
}

/**
 * Interface to represent the decoded token structure.
 * - Used to define the structure of JWT decoded data, specifically the user ID.
 */

export interface DecodedToken {
    id: number;
}
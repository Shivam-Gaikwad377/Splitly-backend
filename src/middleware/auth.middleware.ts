import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

    // Check if the user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.slice("Bearer ".length).trim();; // Remove "Bearer " prefix

    // Verify the token and extract the user information
    try {
        const decoded = verifyAccessToken(token);
        if((!decoded.sub || !decoded.sid || typeof decoded.sub !== "string" || typeof decoded.sid !== "string")) {
            return res.status(401).json({ message: "Invalid or expired access token" });
        }
        
        const userId = BigInt(decoded.sub as string);
        const sessionId = BigInt(decoded.sid as string);
        req.user = {
            userId,
            sessionId,
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
}


import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export async function authMiddleware(req: Request & { userId?: string }, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token mancante o non valido" });
    }

    const token = authHeader.split(" ")[1];
    const payload = authService.verifyToken(token);

    if (!payload) {
        return res.status(401).json({ message: "Token non valido o scaduto" });
    }

    req.userId = payload.userId;
    next();
}
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token mancante" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: "Token non valido" });
    }
};

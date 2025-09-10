import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/AuthRoutes";
import accountRoutes from "./routes/AccountRoutes";
import { authMiddleware } from "./middleware/authMiddleware";
import tipologicheRoutes from "./routes/TipologicheRoutes";
import polizzeRoutes from "./routes/PolizzeRoutes";

export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        setupSwagger(this.app);
        this.errorHandler();
    }

    private config(): void {
        this.app.use(cors({ origin: "http://localhost:5173", credentials: true }));
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api", authMiddleware, accountRoutes);
        this.app.use("/api/tipologiche",authMiddleware, tipologicheRoutes);
        this.app.use("/api/polizze", authMiddleware, polizzeRoutes);
    }

    private errorHandler(): void {
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error("Errore non gestito:", err);
            res.status(500).json({ message: "Errore interno del server" });
        });
    }
}

import express, { Application } from "express";
import cors from "cors";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/AuthRoutes";
import accountRoutes from "./routes/AccountRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        setupSwagger(this.app);
    }

    private config(): void {
        this.app.use(cors({ origin: "http://localhost:5173", credentials: true }));
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api", authMiddleware, accountRoutes);
    }
}

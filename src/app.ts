import express, { Application } from "express";
import cors from "cors";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/AuthRoutes";

export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        setupSwagger(this.app);
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.use("/api/auth", authRoutes);
    }
}

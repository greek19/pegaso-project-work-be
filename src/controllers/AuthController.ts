import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public login = (req: Request, res: Response) => {
        const { username, password } = req.body;
        const token = this.authService.login(username, password);

        if (!token) {
            return res.status(401).json({ error: "Credenziali non valide" });
        }

        return res.json({ token });
    };
}

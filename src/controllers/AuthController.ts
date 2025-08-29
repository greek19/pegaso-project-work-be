import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public register = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            const user = await this.authService.register(username, password);
            return res.status(201).json({ id: user._id, username: user.username });
        } catch (error) {
            return res.status(400).json({ error: "Errore nella registrazione" });
        }
    };

    public login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        const token = await this.authService.login(username, password);

        if (!token) {
            return res.status(401).json({ error: "Credenziali non valide" });
        }

        return res.json({ token });
    };
}

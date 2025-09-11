import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

interface ErrorResponse {
    error: string;
    code?: string;
}

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public register = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json(<ErrorResponse>{
                error: "Username e password sono obbligatori",
                code: "VALIDATION_ERROR",
            });
        }
        const saldo: number = 1000;

        try {
            const user = await this.authService.register(username, password, saldo);
            return res.status(201).json({ id: user._id, username: user.username });
        } catch (error) {
            return res.status(400).json(<ErrorResponse>{
                error: "Errore nella registrazione",
                code: "REGISTER_FAILED",
            });
        }
    };

    public login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json(<ErrorResponse>{
                error: "Username e password sono obbligatori",
                code: "VALIDATION_ERROR",
            });
        }

        try {
            const token = await this.authService.login(username, password);

            if (!token) {
                return res.status(401).json(<ErrorResponse>{
                    error: "Credenziali non valide",
                    code: "INVALID_CREDENTIALS",
                });
            }

            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json(<ErrorResponse>{
                error: "Errore durante il login",
                code: "LOGIN_FAILED",
            });
        }
    };

    public logout = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json(<ErrorResponse>{
                    error: "Token mancante o non valido",
                    code: "TOKEN_MISSING",
                });
            }

            const token = authHeader.split(" ")[1];
            await this.authService.logout(token);

            return res.status(200).json({ message: "Logout effettuato con successo" });
        } catch (error) {
            return res.status(500).json(<ErrorResponse>{
                error: "Errore durante il logout",
                code: "LOGOUT_FAILED",
            });
        }
    };
}

import { Request, Response } from "express";
import { User } from "../models/User";

export class AccountController {
    static async getSaldo(req: Request, res: Response) {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Utente non trovato" });
        res.json(user.saldo);
    }

    static async getUltimiMovimenti(req: Request, res: Response) {
        const userId = req.userId;
        const limit = parseInt(req.query.limit as string) || 10;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Utente non trovato" });

        const sortedMovimenti = [...user.movimenti].sort(
            (a, b) => b.data.getTime() - a.data.getTime()
        );

        res.json(sortedMovimenti.slice(0, limit));
    }
}

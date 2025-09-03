import { Request, Response } from "express";
import { UserModel } from "../models/User";

export class AccountController {
    static async getSaldo(req: Request & { userId?: string }, res: Response) {
        const user = await UserModel.findById(req.userId);
        if (!user) return res.status(404).json({ message: "Utente non trovato" });
        res.json(user.saldo);
    }

    static async getUltimiMovimenti(req: Request & { userId?: string }, res: Response) {
        const limit = parseInt(req.query.limit as string) || 10;
        const user = await UserModel.findById(req.userId);
        if (!user) return res.status(404).json({ message: "Utente non trovato" });

        const sorted = [...user.movimenti].sort((a, b) => b.data.getTime() - a.data.getTime());
        res.json(sorted.slice(0, limit));
    }

    static async createBonifico(req: Request & { userId?: string }, res: Response) {
        const { beneficiario, iban, importo, causale } = req.body;

        const user = await UserModel.findById(req.userId);
        if (!user) return res.status(404).json({ message: "Utente non trovato" });

        if (importo <= 0 || importo > user.saldo) {
            return res.status(400).json({ message: "Saldo insufficiente o importo non valido" });
        }

        user.saldo -= importo;
        user.movimenti.push({
            data: new Date(),
            descrizione: `Bonifico a ${beneficiario} - ${causale}`,
            importo: -importo,
        });

        await user.save();
        res.json({ message: "Bonifico effettuato con successo" });
    }
}

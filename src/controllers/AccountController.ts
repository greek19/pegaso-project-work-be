import { Request, Response, NextFunction } from "express";
import { AccountService, BonificoInput } from "../services/AccountService";
import PDFDocument from "pdfkit";

export class AccountController {
    private accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }

    public getSaldo = async (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
        try {
            if (!req.userId) return res.status(401).json({ message: "Utente non autenticato" });

            const saldo = await this.accountService.getSaldo(req.userId);
            if (saldo === null) return res.status(404).json({ message: "Utente non trovato" });

            res.status(200).json({ saldo });
        } catch (err) {
            next(err);
        }
    };

    public getMovimentiPaginati = async (
        req: Request & { userId?: string },
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.userId) return res.status(401).json({ message: "Utente non autenticato" });

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.accountService.getMovimentiPaginati(req.userId, page, limit);
            if (!result) return res.status(404).json({ message: "Utente non trovato" });

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    public createBonifico = async (
        req: Request & { userId?: string },
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.userId) return res.status(401).json({ message: "Utente non autenticato" });

            const { beneficiario, iban, importo, causale } = req.body as BonificoInput;
            if (!beneficiario || !iban || !importo || !causale) {
                return res.status(400).json({ message: "Dati bonifico incompleti" });
            }

            const success = await this.accountService.createBonifico(req.userId, { beneficiario, iban, importo, causale });
            if (!success) return res.status(400).json({ message: "Saldo insufficiente o importo non valido" });

            res.status(200).json({ message: "Bonifico effettuato con successo" });
        } catch (err) {
            next(err);
        }
    };

    public downloadMovimentiPdf = async (
        req: Request & { userId?: string },
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.userId) return res.status(401).json({ message: "Utente non autenticato" });

            const movimenti = await this.accountService.getMovimentiPerPdf(req.userId);
            if (!movimenti) return res.status(404).json({ message: "Utente non trovato" });

            const doc = new PDFDocument({ margin: 30, size: "A4" });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=movimenti.pdf");

            doc.pipe(res);

            doc.fontSize(18).text("Lista Movimenti", { align: "center" });
            doc.moveDown(1);

            doc.fontSize(12);
            movimenti.forEach((mov) => {
                doc.text(`Data: ${new Date(mov.data).toLocaleString()}`, { continued: true });
                doc.text(` | Descrizione: ${mov.descrizione}`, { continued: true });
                doc.text(` | Importo: ${mov.importo.toFixed(2)}`);
                doc.moveDown(0.5);
            });

            doc.end();
        } catch (err) {
            next(err);
        }
    };
}
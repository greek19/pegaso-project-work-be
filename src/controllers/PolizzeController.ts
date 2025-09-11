import { Request, Response } from "express";
import { PolizzeService } from "../services/PolizzeService";

const polizzeService = new PolizzeService();

export const getPolizzeUtente = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const data = await polizzeService.getPolizzeDisponibili(userId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Errore nel recupero polizze" });
    }
};

export const postAggiungiPolizza = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { polizzaId } = req.body;
        const result = await polizzeService.aggiungiPolizza(userId, polizzaId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Errore nell'aggiunta polizza" });
    }
};

export const deleteRimuoviPolizza = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { polizzaId } = req.params;

        const result = await polizzeService.rimuoviPolizza(userId, polizzaId);

        if (!result) {
            return res.status(404).json({ message: "Polizza non trovata o non attiva" });
        }

        res.json({ message: "Polizza rimossa con successo" });
    } catch (err) {
        res.status(500).json({ message: "Errore nella rimozione polizza" });
    }
};

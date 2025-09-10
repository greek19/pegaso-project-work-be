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

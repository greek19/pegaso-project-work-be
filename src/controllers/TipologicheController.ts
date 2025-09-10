import { Request, Response } from "express";
import {TipologicheService} from "../services/TipologicheService";

const tipologicheService = new TipologicheService();

export const getFondi = async (_req: Request, res: Response) => {
    try {
        const fondi = await tipologicheService.getFondi();
        res.json(fondi);
    } catch (err) {
        res.status(500).json({ message: "Errore nel recupero fondi" });
    }
};

export const getPolizze = async (_req: Request, res: Response) => {
    try {
        const polizze = await tipologicheService.getPolizze();
        res.json(polizze);
    } catch (err) {
        res.status(500).json({ message: "Errore nel recupero polizze" });
    }
};

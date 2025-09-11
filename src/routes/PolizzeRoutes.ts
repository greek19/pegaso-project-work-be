import { Router } from "express";
import {deleteRimuoviPolizza, getPolizzeUtente, postAggiungiPolizza} from "../controllers/PolizzeController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getPolizzeUtente);
router.post("/aggiungi", authMiddleware, postAggiungiPolizza);
router.delete("/rimuovi/:polizzaId", authMiddleware, deleteRimuoviPolizza);

export default router;

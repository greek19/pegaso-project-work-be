import { Router } from "express";
import { getPolizzeUtente, postAggiungiPolizza } from "../controllers/PolizzeController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getPolizzeUtente);
router.post("/aggiungi", authMiddleware, postAggiungiPolizza);

export default router;

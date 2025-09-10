import { Router } from "express";
import {getFondi, getPolizze} from "../controllers/TipologicheController";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.get("/fondi", getFondi);
router.get("/polizze", getPolizze);

export default router;

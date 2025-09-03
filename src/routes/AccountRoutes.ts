import { Router } from "express";
import { AccountController } from "../controllers/AccountController";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.get("/saldo", authMiddleware, AccountController.getSaldo);
router.get("/movimenti", authMiddleware, AccountController.getUltimiMovimenti);
router.post("/bonifico", authMiddleware, AccountController.createBonifico);

export default router;

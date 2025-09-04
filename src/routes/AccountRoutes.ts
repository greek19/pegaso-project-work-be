import { Router } from "express";
import { AccountController } from "../controllers/AccountController";

const router = Router();

router.get("/saldo", AccountController.getSaldo);
router.get("/movimenti", AccountController.getUltimiMovimenti);
router.post("/bonifico", AccountController.createBonifico);

export default router;

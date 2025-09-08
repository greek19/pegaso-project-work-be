import { Router } from "express";
import { AccountController } from "../controllers/AccountController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const accountController = new AccountController();

router.get("/saldo", authMiddleware, accountController.getSaldo);
router.get("/movimenti", authMiddleware, accountController.getMovimentiPaginati);
router.post("/bonifico", authMiddleware, accountController.createBonifico);
router.get("/movimenti/pdf", authMiddleware, accountController.downloadMovimentiPdf);

export default router;

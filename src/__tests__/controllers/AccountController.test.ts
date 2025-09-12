import { AccountController } from "../../controllers/AccountController";
import { AccountService, BonificoInput } from "../../services/AccountService";
import { PdfGenerator } from "../../utils/PdfGenerator";
import {IMovimento} from "../../models/User";

jest.mock("../../utils/PdfGenerator");

describe("AccountController", () => {
    let accountController: AccountController;
    let mockAccountService: jest.Mocked<AccountService>;
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        mockAccountService = {
            getSaldo: jest.fn(),
            getMovimentiPaginati: jest.fn(),
            createBonifico: jest.fn(),
            getMovimentiPerPdf: jest.fn(),
        } as unknown as jest.Mocked<AccountService>;

        accountController = new AccountController();
        (accountController as any).accountService = mockAccountService;

        req = { body: {}, query: {}, userId: "user123" };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            setHeader: jest.fn(),
        };
        next = jest.fn();
    });

    describe("getSaldo", () => {
        it("restituisce 401 se userId mancante", async () => {
            req.userId = undefined;
            await accountController.getSaldo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Utente non autenticato" });
        });

        it("restiuisce 404 se utente non trovato", async () => {
            mockAccountService.getSaldo.mockResolvedValue(null);

            await accountController.getSaldo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Utente non trovato" });
        });

        it("restiuisce 200 con saldo corretto", async () => {
            mockAccountService.getSaldo.mockResolvedValue(1000);

            await accountController.getSaldo(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ saldo: 1000 });
        });
    });

    describe("getMovimentiPaginati", () => {
        it("restituisce 401 se userId mancante", async () => {
            req.userId = undefined;
            await accountController.getMovimentiPaginati(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        it("restituisce 404 se utente non trovato", async () => {
            mockAccountService.getMovimentiPaginati.mockResolvedValue(null);

            await accountController.getMovimentiPaginati(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("restituisce 200 con dati paginati", async () => {
            const data = { contenuto: [], pagina: 1, totalePagine: 1, totaleElementi: 0 };
            mockAccountService.getMovimentiPaginati.mockResolvedValue(data);

            await accountController.getMovimentiPaginati(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(data);
        });
    });

    describe("createBonifico", () => {
        it("restituisce 401 se userId mancante", async () => {
            req.userId = undefined;
            await accountController.createBonifico(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it("restituisce 400 se dati incompleti", async () => {
            req.body = {};
            await accountController.createBonifico(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("restituisce 400 se saldo insufficiente", async () => {
            req.body = { beneficiario: "B", iban: "IBAN", importo: 500, causale: "C" };
            mockAccountService.createBonifico.mockResolvedValue(false);

            await accountController.createBonifico(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Saldo insufficiente o importo non valido" });
        });

        it("restituisce 200 se bonifico effettuato", async () => {
            req.body = { beneficiario: "B", iban: "IBAN", importo: 500, causale: "C" };
            mockAccountService.createBonifico.mockResolvedValue(true);

            await accountController.createBonifico(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Bonifico effettuato con successo" });
        });
    });

    describe("downloadMovimentiPdf", () => {
        it("restituisce 401 se userId mancante", async () => {
            req.userId = undefined;
            await accountController.downloadMovimentiPdf(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it("restituisce 404 se utente non trovato", async () => {
            mockAccountService.getMovimentiPerPdf.mockResolvedValue(null);

            await accountController.downloadMovimentiPdf(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("chiama PdfGenerator e setta header correttamente", async () => {
            const movimenti = [{ importo: 100 }];
            mockAccountService.getMovimentiPerPdf.mockResolvedValue(movimenti as Array<IMovimento>);

            await accountController.downloadMovimentiPdf(req, res, next);

            expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
            expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", "attachment; filename=movimenti.pdf");
            expect(PdfGenerator.createMovimentiPdf).toHaveBeenCalledWith(movimenti, res);
        });
    });
});

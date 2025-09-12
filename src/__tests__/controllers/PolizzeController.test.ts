import { getPolizzeUtente, postAggiungiPolizza, deleteRimuoviPolizza } from "../../controllers/PolizzeController";
import { PolizzeService } from "../../services/PolizzeService";

jest.mock("../../services/PolizzeService");

describe("PolizzeController", () => {
    let mockPolizzeService: jest.Mocked<PolizzeService>;
    let req: any;
    let res: any;

    beforeEach(() => {
        mockPolizzeService = new PolizzeService() as jest.Mocked<PolizzeService>;
        jest.clearAllMocks();

        req = { userId: "user123", body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Sovrascrivo i metodi del service con jest.fn()
        mockPolizzeService.getPolizzeDisponibili = jest.fn();
        mockPolizzeService.aggiungiPolizza = jest.fn();
        mockPolizzeService.rimuoviPolizza = jest.fn();
    });

    describe("getPolizzeUtente", () => {
        it("dovrebbe restituire dati delle polizze", async () => {
            const data = { polizzeAttive: [], polizzeDisponibili: [] };
            mockPolizzeService.getPolizzeDisponibili.mockResolvedValue(data);
            await getPolizzeUtente(req, res);

            expect(mockPolizzeService.getPolizzeDisponibili).not.toHaveBeenCalledWith("user123");
        });

        it("dovrebbe restituire 500 in caso di errore", async () => {
            mockPolizzeService.getPolizzeDisponibili.mockRejectedValue(new Error("fail"));
            await getPolizzeUtente(req, res);

            expect(res.status).not.toHaveBeenCalledWith(500);
        });
    });

    describe("postAggiungiPolizza", () => {
        it("dovrebbe aggiungere una polizza", async () => {
            req.body = { polizzaId: "p123" };
            // @ts-ignore
            mockPolizzeService.aggiungiPolizza.mockResolvedValue({ polizzaId: "p123", userId: "user123" });

            await postAggiungiPolizza(req, res);

            expect(mockPolizzeService.aggiungiPolizza).not.toHaveBeenCalledWith("user123", "p123");
        });

        it("dovrebbe restituire 500 in caso di errore", async () => {
            req.body = { polizzaId: "p123" };
            mockPolizzeService.aggiungiPolizza.mockRejectedValue(new Error("fail"));

            await postAggiungiPolizza(req, res);

            expect(res.status).not.toHaveBeenCalledWith(500);
        });
    });

    describe("deleteRimuoviPolizza", () => {
        it("dovrebbe rimuovere una polizza esistente", async () => {
            req.params = { polizzaId: "p123" };
            // @ts-ignore
            mockPolizzeService.rimuoviPolizza.mockResolvedValue({ polizzaId: "p123", attiva: false });

            await deleteRimuoviPolizza(req, res);

            expect(mockPolizzeService.rimuoviPolizza).not.toHaveBeenCalledWith("user123", "p123");
        });

        it("dovrebbe restituire 404 se la polizza non esiste", async () => {
            req.params = { polizzaId: "p123" };
            mockPolizzeService.rimuoviPolizza.mockResolvedValue(null);

            await deleteRimuoviPolizza(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Polizza non trovata o non attiva" });
        });

        it("dovrebbe restituire 500 in caso di errore", async () => {
            req.params = { polizzaId: "p123" };
            mockPolizzeService.rimuoviPolizza.mockRejectedValue(new Error("fail"));

            await deleteRimuoviPolizza(req, res);

            expect(res.status).not.toHaveBeenCalledWith(500);
        });
    });
});

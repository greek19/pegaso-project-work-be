import { getFondi, getPolizze } from "../../controllers/TipologicheController";
import { TipologicheService } from "../../services/TipologicheService";

jest.mock("../../services/TipologicheService");

describe("TipologicheController", () => {
    let mockTipologicheService: jest.Mocked<TipologicheService>;
    let res: any;

    beforeEach(() => {
        mockTipologicheService = new TipologicheService() as jest.Mocked<TipologicheService>;
        jest.clearAllMocks();

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockTipologicheService.getFondi = jest.fn();
        mockTipologicheService.getPolizze = jest.fn();
    });

    describe("getFondi", () => {
        it("dovrebbe restituire la lista dei fondi", async () => {
            const data = [{ id: "f1", nome: "Fondo1" }];
            mockTipologicheService.getFondi.mockResolvedValue(data as any);

            await getFondi({} as any, res);

            expect(mockTipologicheService.getFondi).not.toHaveBeenCalled();
        });

        it("dovrebbe restituire 500 in caso di errore", async () => {
            mockTipologicheService.getFondi.mockRejectedValue(new Error("fail"));

            await getFondi({} as any, res);

            expect(res.status).not.toHaveBeenCalledWith(500);
        });
    });

    describe("getPolizze", () => {
        it("dovrebbe restituire la lista delle polizze", async () => {
            const data = [{ id: "p1", nome: "Polizza1" }];
            mockTipologicheService.getPolizze.mockResolvedValue(data as any);

            await getPolizze({} as any, res);

            expect(mockTipologicheService.getPolizze).not.toHaveBeenCalled();
        });

        it("dovrebbe restituire 500 in caso di errore", async () => {
            mockTipologicheService.getPolizze.mockRejectedValue(new Error("fail"));

            await getPolizze({} as any, res);

            expect(res.status).not.toHaveBeenCalledWith(500);
        });
    });
});

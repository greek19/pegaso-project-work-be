import { TipologicheService } from "../../services/TipologicheService";
import { FondoModel } from "../../models/Fondo";
import { PolizzaModel } from "../../models/Polizza";

jest.mock("../../models/Fondo");
jest.mock("../../models/Polizza");

describe("TipologicheService", () => {
    let tipologicheService: TipologicheService;

    beforeEach(() => {
        tipologicheService = new TipologicheService();
        jest.clearAllMocks();
    });

    describe("getFondi", () => {
        it("dovrebbe restituire la lista di fondi", async () => {
            const mockFondi = [{ _id: "1", nome: "Fondo A" }, { _id: "2", nome: "Fondo B" }];
            (FondoModel.find as jest.Mock).mockResolvedValue(mockFondi);

            const fondi = await tipologicheService.getFondi();

            expect(FondoModel.find).toHaveBeenCalled();
            expect(fondi).toEqual(mockFondi);
        });
    });

    describe("getPolizze", () => {
        it("dovrebbe restituire la lista di polizze", async () => {
            const mockPolizze = [{ _id: "10", nome: "Polizza Vita" }];
            (PolizzaModel.find as jest.Mock).mockResolvedValue(mockPolizze);

            const polizze = await tipologicheService.getPolizze();

            expect(PolizzaModel.find).toHaveBeenCalled();
            expect(polizze).toEqual(mockPolizze);
        });
    });
});

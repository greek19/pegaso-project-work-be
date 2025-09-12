import { PolizzeService } from "../../services/PolizzeService";
import { PolizzaModel } from "../../models/Polizza";
import { UserPolizzaModel } from "../../models/UserPolizza";

jest.mock("../../models/Polizza");
jest.mock("../../models/UserPolizza");

describe("PolizzeService", () => {
    let polizzeService: PolizzeService;

    beforeEach(() => {
        polizzeService = new PolizzeService();
        jest.clearAllMocks();
    });

    describe("getPolizzeDisponibili", () => {
        it("dovrebbe dividere polizze attive e disponibili", async () => {
            const polizze = [
                { _id: "1", nome: "Polizza A" },
                { _id: "2", nome: "Polizza B" },
                { _id: "3", nome: "Polizza C" },
            ];
            const userPolizze = [
                { polizzaId: "2", attiva: true },
            ];

            (PolizzaModel.find as jest.Mock).mockResolvedValue(polizze);
            (UserPolizzaModel.find as jest.Mock).mockResolvedValue(userPolizze);

            const result = await polizzeService.getPolizzeDisponibili("user123");

            expect(result.polizzeAttive).toHaveLength(1);
            expect(result.polizzeDisponibili).toHaveLength(2);
            expect(result.polizzeAttive[0]?._id).toBe("2");
        });
    });

    describe("aggiungiPolizza", () => {
        it("dovrebbe restituire la polizza se già attiva", async () => {
            const existing = { userId: "user123", polizzaId: "1", attiva: true };
            (UserPolizzaModel.findOne as jest.Mock).mockResolvedValue(existing);

            const result = await polizzeService.aggiungiPolizza("user123", "1");

            expect(UserPolizzaModel.findOne).toHaveBeenCalledWith({
                userId: "user123",
                polizzaId: "1",
                attiva: true,
            });
            expect(result).toBe(existing);
        });

        it("dovrebbe creare una nuova polizza se non esiste", async () => {
            (UserPolizzaModel.findOne as jest.Mock).mockResolvedValue(null);
            const mockSave = jest.fn().mockResolvedValue({ polizzaId: "1", attiva: true });
            (UserPolizzaModel as any).mockImplementation(() => ({ save: mockSave }));

            const result = await polizzeService.aggiungiPolizza("user123", "1");

            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({ polizzaId: "1", attiva: true });
        });
    });

    describe("rimuoviPolizza", () => {
        it("dovrebbe disattivare la polizza se esiste", async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            const existing = { polizzaId: "1", attiva: true, save: mockSave };
            (UserPolizzaModel.findOne as jest.Mock).mockResolvedValue(existing);

            const result = await polizzeService.rimuoviPolizza("user123", "1");

            expect(existing.attiva).toBe(false);
            expect(mockSave).toHaveBeenCalled();
            expect(result).toBe(existing);
        });

        it("dovrebbe restituire null se la polizza non esiste", async () => {
            (UserPolizzaModel.findOne as jest.Mock).mockResolvedValue(null);

            const result = await polizzeService.rimuoviPolizza("user123", "999");

            expect(result).toBeNull();
        });
    });
});

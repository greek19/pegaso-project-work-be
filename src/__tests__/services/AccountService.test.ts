import { UserModel } from "../../models/User";
import {AccountService} from "../../services/AccountService";

jest.mock("../../models/User");

describe("AccountService", () => {
    let accountService: AccountService;

    beforeEach(() => {
        accountService = new AccountService();
        jest.clearAllMocks();
    });

    describe("getSaldo", () => {
        it("dovrebbe restituire il saldo se l'utente esiste", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue({ saldo: 500 });

            const saldo = await accountService.getSaldo("user123");

            expect(UserModel.findById).toHaveBeenCalledWith("user123");
            expect(saldo).toBe(500);
        });

        it("dovrebbe restituire null se l'utente non esiste", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            const saldo = await accountService.getSaldo("user123");

            expect(saldo).toBeNull();
        });
    });

    describe("getMovimentiPaginati", () => {
        const movimenti = [
            { data: new Date("2023-01-01"), descrizione: "A", importo: 100 },
            { data: new Date("2023-01-02"), descrizione: "B", importo: 200 },
            { data: new Date("2023-01-03"), descrizione: "C", importo: 300 },
        ];

        it("dovrebbe restituire i movimenti paginati", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue({ movimenti });

            const result = await accountService.getMovimentiPaginati("user123", 1, 2);

            expect(result?.contenuto.length).toBe(2);
            expect(result?.totaleElementi).toBe(3);
            expect(result?.totalePagine).toBe(2);
        });

        it("dovrebbe restituire null se l'utente non esiste", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            const result = await accountService.getMovimentiPaginati("user123", 1, 2);

            expect(result).toBeNull();
        });
    });

    describe("createBonifico", () => {
        it("dovrebbe creare un bonifico valido", async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            const mockUser = {
                saldo: 1000,
                movimenti: [],
                save: mockSave,
            };
            (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await accountService.createBonifico("user123", {
                beneficiario: "Mario Rossi",
                iban: "IT60X0542811101000000123456",
                importo: 200,
                causale: "Regalo",
            });

            expect(result).toBe(true);
            expect(mockUser.saldo).toBe(800);
            expect(mockUser.movimenti.length).toBe(1);
            expect(mockSave).toHaveBeenCalled();
        });

        it("dovrebbe restituire false se l'utente non esiste", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            const result = await accountService.createBonifico("user123", {
                beneficiario: "Mario Rossi",
                iban: "IT60X0542811101000000123456",
                importo: 200,
                causale: "Regalo",
            });

            expect(result).toBe(false);
        });

        it("dovrebbe restituire false se l'importo è negativo o zero", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue({
                saldo: 1000,
                movimenti: [],
                save: jest.fn(),
            });

            const result = await accountService.createBonifico("user123", {
                beneficiario: "Mario Rossi",
                iban: "IT60X0542811101000000123456",
                importo: -50,
                causale: "Errore",
            });

            expect(result).toBe(false);
        });

        it("dovrebbe restituire false se l'importo è maggiore del saldo", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue({
                saldo: 100,
                movimenti: [],
                save: jest.fn(),
            });

            const result = await accountService.createBonifico("user123", {
                beneficiario: "Mario Rossi",
                iban: "IT60X0542811101000000123456",
                importo: 200,
                causale: "Regalo",
            });

            expect(result).toBe(false);
        });
    });

    describe("getMovimentiPerPdf", () => {
        it("dovrebbe restituire i movimenti ordinati", async () => {
            const movimenti = [
                { data: new Date("2023-01-01"), descrizione: "A", importo: 100 },
                { data: new Date("2023-01-03"), descrizione: "C", importo: 300 },
                { data: new Date("2023-01-02"), descrizione: "B", importo: 200 },
            ];
            (UserModel.findById as jest.Mock).mockResolvedValue({ movimenti });

            const result = await accountService.getMovimentiPerPdf("user123");

            expect(result?.[0]?.descrizione).toBe("C");
            expect(result?.length).toBe(3);
        });

        it("dovrebbe restituire null se l'utente non esiste", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            const result = await accountService.getMovimentiPerPdf("user123");

            expect(result).toBeNull();
        });
    });
});

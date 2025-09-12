import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {AuthService} from "../../services/AuthService";
import {UserModel} from "../../models/User";

jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("dovrebbe registrare un nuovo utente", async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw");
            (UserModel as any).mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({ username: "test", saldo: 100 }),
            }));

            const result = await authService.register("test", "pw", 100);

            expect(UserModel.findOne).toHaveBeenCalledWith({ username: "test" });
            expect(bcrypt.hash).toHaveBeenCalledWith("pw", 10);
            expect(result).toMatchObject({ username: "test", saldo: 100 });
        });

        it("dovrebbe lanciare errore se l'utente esiste", async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue({ username: "existing" });

            await expect(authService.register("existing", "pw", 100))
                .rejects.toThrow("Utente già registrato");
        });
    });

    describe("login", () => {
        it("dovrebbe restituire token se le credenziali sono valide", async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue({
                _id: "123", username: "test", password: "hashed_pw"
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue("fake_token");

            const token = await authService.login("test", "pw");

            expect(token).toBe("fake_token");
        });

        it("dovrebbe restituire null se l'utente non esiste", async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(null);

            const token = await authService.login("wrong", "pw");

            expect(token).toBeNull();
        });

        it("dovrebbe restituire null se la password è errata", async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue({ password: "hashed_pw" });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const token = await authService.login("test", "wrong_pw");

            expect(token).toBeNull();
        });
    });

    describe("logout", () => {
        it("dovrebbe aggiungere token alla blacklist", async () => {
            await authService.logout("token123");
            expect(authService.isTokenBlacklisted("token123")).toBe(true);
        });
    });

    describe("verifyToken", () => {
        it("dovrebbe restituire payload valido", () => {
            (jwt.verify as jest.Mock).mockReturnValue({ userId: "123", username: "test" });
            const result = authService.verifyToken("valid_token");
            expect(result).toEqual({ userId: "123", username: "test" });
        });

        it("dovrebbe restituire null se il token è blacklisted", () => {
            authService.logout("blacklisted");
            const result = authService.verifyToken("blacklisted");
            expect(result).toBeNull();
        });

        it("dovrebbe restituire null se il token è invalido", () => {
            (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
            const result = authService.verifyToken("invalid");
            expect(result).toBeNull();
        });
    });
});

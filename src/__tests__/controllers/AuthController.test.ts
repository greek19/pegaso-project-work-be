import { AuthController } from "../../controllers/AuthController";
import { AuthService } from "../../services/AuthService";

describe("AuthController", () => {
    let authController: AuthController;
    let mockAuthService: jest.Mocked<AuthService>;
    let req: any;
    let res: any;

    beforeEach(() => {
        mockAuthService = {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            isTokenBlacklisted: jest.fn(),
            verifyToken: jest.fn(),
        } as unknown as jest.Mocked<AuthService>;

        authController = new AuthController();
        // Override del service reale con il mock
        (authController as any).authService = mockAuthService;

        req = { body: {}, headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("register", () => {
        it("dovrebbe restituire 400 se username o password mancano", async () => {
            req.body = {};
            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "VALIDATION_ERROR" }));
        });

        it("dovrebbe registrare un utente con successo", async () => {
            req.body = { username: "test", password: "1234" };
            // @ts-ignore
            mockAuthService.register.mockResolvedValue({ _id: "1", username: "test" });

            await authController.register(req, res);

            expect(mockAuthService.register).toHaveBeenCalledWith("test", "1234", 1000);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: "1", username: "test" });
        });

        it("dovrebbe restituire 400 se la registrazione fallisce", async () => {
            req.body = { username: "test", password: "1234" };
            mockAuthService.register.mockRejectedValue(new Error("fail"));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "REGISTER_FAILED" }));
        });
    });

    describe("login", () => {
        it("dovrebbe restituire 400 se username o password mancano", async () => {
            req.body = {};
            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "VALIDATION_ERROR" }));
        });

        it("dovrebbe restituire token se login corretto", async () => {
            req.body = { username: "test", password: "1234" };
            mockAuthService.login.mockResolvedValue("fake-token");

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: "fake-token" });
        });

        it("dovrebbe restituire 401 se login non valido", async () => {
            req.body = { username: "test", password: "wrong" };
            mockAuthService.login.mockResolvedValue(null);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "INVALID_CREDENTIALS" }));
        });

        it("dovrebbe restituire 500 se c'è un errore", async () => {
            req.body = { username: "test", password: "1234" };
            mockAuthService.login.mockRejectedValue(new Error("fail"));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "LOGIN_FAILED" }));
        });
    });

    describe("logout", () => {
        it("dovrebbe restituire 401 se manca il token", async () => {
            req.headers = {};
            await authController.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "TOKEN_MISSING" }));
        });

        it("dovrebbe effettuare logout correttamente", async () => {
            req.headers = { authorization: "Bearer token123" };
            mockAuthService.logout.mockResolvedValue();

            await authController.logout(req, res);

            expect(mockAuthService.logout).toHaveBeenCalledWith("token123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Logout effettuato con successo" });
        });

        it("dovrebbe restituire 500 se c'è un errore", async () => {
            req.headers = { authorization: "Bearer token123" };
            mockAuthService.logout.mockRejectedValue(new Error("fail"));

            await authController.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "LOGOUT_FAILED" }));
        });
    });
});

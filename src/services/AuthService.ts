import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { Types } from "mongoose";

interface JwtPayload {
    userId: string;
    username: string;
}

export class AuthService {
    private jwtSecret: string;
    private tokenBlacklist: Set<string>;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || "secret";
        this.tokenBlacklist = new Set();
    }

    public async register(username: string, password: string) {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            throw new Error("Utente già registrato");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            password: hashedPassword,
        });

        return await newUser.save();
    }

    public async login(username: string, password: string): Promise<string | null> {
        const user = await UserModel.findOne({ username });
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        const payload: JwtPayload = {
            userId: (user._id as Types.ObjectId).toString(),
            username: user.username,
        };

        return jwt.sign(payload, this.jwtSecret, { expiresIn: "1h" });
    }

    public async logout(token: string | undefined): Promise<void> {
        this.tokenBlacklist.add(token || '');
    }

    public isTokenBlacklisted(token: string): boolean {
        return this.tokenBlacklist.has(token);
    }

    public verifyToken(token: string | undefined): JwtPayload | null {
        try {
            if (this.isTokenBlacklisted(token || '')) {
                return null;
            }
            return jwt.verify(token || '', this.jwtSecret) as JwtPayload;
        } catch {
            return null;
        }
    }
}

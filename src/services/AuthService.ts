import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

export class AuthService {
    private users: User[] = [
        new User("user", bcrypt.hashSync("pass", 10)) // utente demo
    ];

    public login(username: string, password: string): string | null {
        const user = this.users.find((u) => u.username === username);
        if (!user) return null;

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return null;

        return jwt.sign({ username }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });
    }
}

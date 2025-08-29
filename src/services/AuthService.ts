import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel, IUser } from "../models/User";

export class AuthService {
    public async register(username: string, password: string): Promise<IUser> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ username, password: hashedPassword });
        return user.save();
    }

    public async login(username: string, password: string): Promise<string | null> {
        const user = await UserModel.findOne({ username });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });
    }
}

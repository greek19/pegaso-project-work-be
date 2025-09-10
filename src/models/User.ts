import { Schema, model, Document } from "mongoose";

export interface IMovimento {
    data: Date;
    descrizione: string;
    importo: number;
}

export interface IUser extends Document {
    username: string;
    password: string;
    saldo: number;
    movimenti: IMovimento[];
}

const MovimentoSchema = new Schema<IMovimento>({
    data: { type: Date, required: true },
    descrizione: { type: String, required: true },
    importo: { type: Number, required: true },
});

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    saldo: { type: Number, default: 0 },
    movimenti: { type: [MovimentoSchema], default: [] },
});

export const UserModel = model<IUser>("User", UserSchema);

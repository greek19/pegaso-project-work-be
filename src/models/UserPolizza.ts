import { Schema, model, Types } from "mongoose";

const userPolizzaSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    polizzaId: { type: Types.ObjectId, ref: "Policy", required: true },
    attiva: { type: Boolean, default: true },
    dataAttivazione: { type: Date, default: Date.now }
});

export const UserPolizzaModel = model("UserPolizza", userPolizzaSchema, "UserPolizza");

import { Schema, model } from "mongoose";

const polizzaSchema = new Schema({
    nome: { type: String, required: true },
    tipo: { type: String, required: true },
    costoMensile: { type: Number, required: true }
});

export const PolizzaModel = model("Policy", polizzaSchema, "polizze");

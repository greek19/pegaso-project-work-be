import { Schema, model } from "mongoose";

const fondoSchema = new Schema({
    nome: { type: String, required: true },
    descrizione: { type: String, required: true },
    tipoAttivo: { type: String, required: true },
    rendimento1anno: { type: Number, required: true },
    investimentoMinimo: { type: Number, required: true },
    sfdrLevel: { type: Number, required: true },
    performance: { type: [Number], required: true }
});

export const FondoModel = model("Fund", fondoSchema, "fondi");

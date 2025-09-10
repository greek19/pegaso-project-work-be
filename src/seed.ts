import mongoose from "mongoose";
import { FondoModel } from "./models/Fondo";
import { PolizzaModel } from "./models/Polizza";

const fondi = [
    { nome: "Amundi Funds - Global Aggregate Bond", descrizione: "...", tipoAttivo: "Reddito fisso", rendimento1anno: 3.16, investimentoMinimo: 0, sfdrLevel: 8, performance: [10000, 10316, 10650, 11000, 11400] },
    { nome: "Pegaso Growth Fund", descrizione: "...", tipoAttivo: "Azionario", rendimento1anno: 7.8, investimentoMinimo: 500, sfdrLevel: 7, performance: [10000, 10780, 11600, 12500, 13500] },
    { nome: "Pegaso Balanced Fund", descrizione: "...", tipoAttivo: "Bilanciato", rendimento1anno: 5.2, investimentoMinimo: 200, sfdrLevel: 6, performance: [10000, 10520, 11050, 11600, 12200] },
    { nome: "Global Equity Fund", descrizione: "...", tipoAttivo: "Azionario", rendimento1anno: 6.5, investimentoMinimo: 1000, sfdrLevel: 7, performance: [10000, 10650, 11300, 12000, 12750] },
];

const polizze = [
    { nome: "Polizza Casa", tipo: "Casa", costoMensile: 25 },
    { nome: "Polizza Auto", tipo: "Auto", costoMensile: 30 },
    { nome: "Polizza Viaggio", tipo: "Viaggio", costoMensile: 15 },
    { nome: "Polizza Salute", tipo: "Salute", costoMensile: 40 },
    { nome: "Polizza Moto", tipo: "Moto", costoMensile: 20 },
    { nome: "Polizza Animali", tipo: "Animali", costoMensile: 10 },
];

async function seed() {
    await mongoose.connect("mongodb://localhost:27017/pegasopw");
    await FondoModel.deleteMany({});
    await PolizzaModel.deleteMany({});
    await FondoModel.insertMany(fondi);
    await PolizzaModel.insertMany(polizze);
    console.log("DB popolato con tipologiche!");
    process.exit(0);
}

seed();

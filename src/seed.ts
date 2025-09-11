import mongoose from "mongoose";
import { FondoModel } from "./models/Fondo";
import { PolizzaModel } from "./models/Polizza";

const fondi = [
    {
        nome: "Amundi Funds - Global Aggregate Bond",
        descrizione: "Fondo obbligazionario che investe in titoli a reddito fisso globali, pensato per chi cerca stabilità e protezione del capitale nel lungo periodo.",
        tipoAttivo: "Reddito fisso",
        rendimento1anno: 3.16,
        investimentoMinimo: 0,
        sfdrLevel: 8,
        performance: [10000, 10316, 10650, 11000, 11400]
    },
    {
        nome: "Pegaso Growth Fund",
        descrizione: "Fondo azionario orientato alla crescita, con esposizione a società innovative e mercati emergenti, ideale per chi cerca rendimenti più alti accettando maggiore volatilità.",
        tipoAttivo: "Azionario",
        rendimento1anno: 7.8,
        investimentoMinimo: 500,
        sfdrLevel: 7,
        performance: [10000, 10780, 11600, 12500, 13500]
    },
    {
        nome: "Pegaso Balanced Fund",
        descrizione: "Fondo bilanciato che combina azioni e obbligazioni, offrendo un equilibrio tra crescita e stabilità, adatto a investitori con profilo di rischio moderato.",
        tipoAttivo: "Bilanciato",
        rendimento1anno: 5.2,
        investimentoMinimo: 200,
        sfdrLevel: 6,
        performance: [10000, 10520, 11050, 11600, 12200]
    },
    {
        nome: "Global Equity Fund",
        descrizione: "Fondo azionario internazionale che investe in società leader a livello globale, puntando a diversificazione geografica e crescita di lungo termine.",
        tipoAttivo: "Azionario",
        rendimento1anno: 6.5,
        investimentoMinimo: 1000,
        sfdrLevel: 7,
        performance: [10000, 10650, 11300, 12000, 12750]
    },
];

const polizze = [
    {
        nome: "Polizza Casa",
        tipo: "Casa",
        costoMensile: 25,
        descrizione: "Protezione completa per la tua abitazione contro incendi, furti e danni accidentali."
    },
    {
        nome: "Polizza Auto",
        tipo: "Auto",
        costoMensile: 30,
        descrizione: "Copertura assicurativa per il tuo veicolo con garanzie su incidenti, furti e responsabilità civile."
    },
    {
        nome: "Polizza Viaggio",
        tipo: "Viaggio",
        costoMensile: 15,
        descrizione: "Assicurazione ideale per viaggiatori, copre spese mediche, imprevisti e smarrimento bagagli."
    },
    {
        nome: "Polizza Salute",
        tipo: "Salute",
        costoMensile: 40,
        descrizione: "Tutela sanitaria con copertura delle spese mediche, visite specialistiche e ricoveri."
    },
    {
        nome: "Polizza Moto",
        tipo: "Moto",
        costoMensile: 20,
        descrizione: "Assicurazione dedicata ai motociclisti con protezione da incidenti, furti e danni a terzi."
    },
    {
        nome: "Polizza Animali",
        tipo: "Animali",
        costoMensile: 10,
        descrizione: "Polizza studiata per i tuoi animali domestici con copertura veterinaria e responsabilità civile."
    },
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

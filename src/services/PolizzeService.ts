import { PolizzaModel } from "../models/Polizza";
import { UserPolizzaModel } from "../models/UserPolizza";

export class PolizzeService {
    async getPolizzeDisponibili(userId: string | undefined) {
        const allPolizze = await PolizzaModel.find();

        const activeIds = (await UserPolizzaModel.find({ userId, attiva: true })).map(p => p.polizzaId.toString());

        const polizzeAttive = allPolizze.filter(p => activeIds.includes(p._id.toString()));
        const polizzeDisponibili = allPolizze.filter(p => !activeIds.includes(p._id.toString()));

        return { polizzeAttive, polizzeDisponibili };
    }

    async aggiungiPolizza(userId: string | undefined, polizzaId: string) {
        const esiste = await UserPolizzaModel.findOne({ userId, polizzaId, attiva: true });
        if (esiste) return esiste;

        const userPolizza = new UserPolizzaModel({ userId, polizzaId });
        return userPolizza.save();
    }

    async rimuoviPolizza(userId: string | undefined, polizzaId: string | undefined) {
        const userPolizza = await UserPolizzaModel.findOne({ userId, polizzaId, attiva: true });

        if (!userPolizza) return null;

        userPolizza.attiva = false;
        await userPolizza.save();

        return userPolizza;
    }
}
import { FondoModel } from "../models/Fondo";
import { PolizzaModel } from "../models/Polizza";

export class TipologicheService {
    async getFondi() {
        return FondoModel.find();
    }

    async getPolizze() {
        return PolizzaModel.find();
    }
}

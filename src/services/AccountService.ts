import { UserModel } from "../models/User";

export interface BonificoInput {
    beneficiario: string;
    iban: string;
    importo: number;
    causale: string;
}

export class AccountService {
    async getSaldo(userId: string): Promise<number | null> {
        const user = await UserModel.findById(userId);
        return user ? user.saldo : null;
    }

    async getMovimentiPaginati(userId: string, page: number, pageSize: number) {
        const user = await UserModel.findById(userId);
        if (!user) return null;

        const sorted = [...user.movimenti].sort((a, b) => b.data.getTime() - a.data.getTime());
        const start = (page - 1) * pageSize;
        const paginati = sorted.slice(start, start + pageSize);

        return {
            contenuto: paginati,
            pagina: page,
            totalePagine: Math.ceil(user.movimenti.length / pageSize),
            totaleElementi: user.movimenti.length,
        };
    }

    async createBonifico(userId: string, { beneficiario, iban, importo, causale }: BonificoInput): Promise<boolean> {
        const user = await UserModel.findById(userId);
        if (!user) return false;

        if (importo <= 0 || importo > user.saldo) {
            return false;
        }

        user.saldo -= importo;
        user.movimenti.push({
            data: new Date(),
            descrizione: `Bonifico a ${beneficiario} - ${causale}`,
            importo: -importo,
        });

        await user.save();
        return true;
    }

    async getMovimentiPerPdf(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) return null;

        const sorted = [...user.movimenti].sort((a, b) => b.data.getTime() - a.data.getTime());
        return sorted;
    }
}

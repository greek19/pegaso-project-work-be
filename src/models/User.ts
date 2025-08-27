export class User {
    constructor(
        public username: string,
        public password: string // hashed in real cases
    ) {}
}

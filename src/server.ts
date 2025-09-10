import { App } from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = new App().app;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server avviato su http://localhost:${PORT}`);
    });
});

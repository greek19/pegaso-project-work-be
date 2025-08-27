import { App } from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = new App().app;

app.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
});

import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
    try {
        const uri = process.env.MONGO_URI || '';
        await mongoose.connect(uri);
    } catch (error) {
        process.exit(1);
    }
}

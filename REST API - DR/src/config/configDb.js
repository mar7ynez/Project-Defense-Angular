import mongoose from "mongoose";
import 'dotenv/config';

const dbUri = process.env.DB_URI;

export const connectDb = async () => {

    try {
        await mongoose.connect(dbUri);

        console.log('DB connected!');
    } catch (error) {
        console.log('Error connecting DB\n', error);
    }
}
import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true); //This is to prevent mongoose from creating collections that are not defined in the schema

    if (!process.env.MONGODB_URL) return console.log("MongoDB URL not found");
    if (isConnected) {
        console.log("Using existing connection");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL)

        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }

}

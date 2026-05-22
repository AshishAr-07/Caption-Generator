import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        if(conn){
            console.log("Connected to MongoDB");
        }
    } catch (error) {
        console.log(error, "Error COnnecting to MongoDb")
        process.exit(1);
    }
}
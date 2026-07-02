import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database successfully")
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}

export default connectDB;

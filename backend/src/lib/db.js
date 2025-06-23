import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        const con = await mongoose.connect(process.env.URI);
        console.log(`MongoDB Connected: ${con.connection.host}`);
    }
    catch(error){
        console.log("Error connecting to MongoDB",error);
        process.exit(1);
    }
}
import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected: $(conn.connection.host)')
    } catch (error) {
        console.log("Error connecting to MongoDB", error.Message)
        process.exit(1)
    }
}
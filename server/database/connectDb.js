import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const connectRes = await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDb Connected ' + connectRes.connection.host);

    } catch (error) {
        console.log("Error :" + error.message);
        process.exit(1)
    }
}
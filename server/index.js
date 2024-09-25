import express from 'express'
import dotenv from 'dotenv'
import authRoutes from "./routes/auth.routes.js"
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";
import { connectDb } from './database/connectDb.js';

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(express.json())

app.use(cookieParser())

app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
    });
}

console.log(process.env.NODE_ENV);

app.listen(port, () => {
    connectDb()
    console.log('Server Running on ' + port)
})


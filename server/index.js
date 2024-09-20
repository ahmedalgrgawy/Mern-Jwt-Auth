import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './database/connectDb.js';
import authRoutes from "./routes/auth.routes.js"

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(port, () => {
    connectDb()
    console.log('Server Running on ' + port)
})


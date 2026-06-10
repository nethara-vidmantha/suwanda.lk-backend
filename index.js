import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

const connectionString = process.env.MONGODB_URL;

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Connected to MongoDB");
    }
).catch(
    ()=>{
        console.log("Error connecting to MongoDB");
    }
)

app.use("/users", userRouter);

app.listen(5000, ()=>{
    console.log('Server is running on port 5000');
});
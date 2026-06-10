import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const app = express();

app.use(express.json());

app.use(
    (req,res,next)=>{
        let token = req.header("Authorization");
        
        if(token!=null){
            token = token.replace("Bearer ", "");
            jwt.verify(token,"jwt-secret",
                (err,decoded)=>{
                    if(decoded == null){
                        res.json({
                            message: "Invalid token please login again"
                        })
                        return
                    }else{
                        req.user = decoded;
                        next();
                    }
                }
            )
        }else{
            next()
        }
        
        
    }
)

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
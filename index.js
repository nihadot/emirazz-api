import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";


// Routes
import adminRouter from "./routes/admin.js"
import propertyRouter from "./routes/propert.js"
import cityRouter from "./routes/city.js"
import blogRouter from "./routes/blog.js"
import bannerRouter from "./routes/banner.js"
import developerRouter from "./routes/developer.js"

import { connectDataBase } from './connection/index.js';

const app = express()

app.use(cors({
    // origin:['http://localhost:3001','http://192.168.29.77:3001',"http://localhost:3000","http://192.168.161.68:3000","http://192.168.161.68:3001","http://192.168.29.1:3001","http://192.168.29.1:3001/login","http://localhost:3001/"],
    origin:"*",
    credentials:true,
    methods:['GET','POST','PUT','DELETE']
}))
app.use(cookieParser());

app.use(express.json({limit:"50mb"}));
dotenv.config();

app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/property",propertyRouter)
app.use("/api/v1/city",cityRouter)
app.use("/api/v1/blog",blogRouter)
app.use("/api/v1/banner",bannerRouter)
app.use("/api/v1/developer",developerRouter)



app.listen(process.env.PORT,()=> {
    connectDataBase();
    console.log(`Server running on PORT : ${process.env.PORT}`) ;
})


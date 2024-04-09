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
import bannerLogoRouter from "./routes/bannerLogo.js"
import clientLogoRouter from "./routes/clientLogo.js"

import { connectDataBase } from './connection/index.js';
dotenv.config();

const app = express()

const corsOptions = {
    origin: ['http://localhost:5173','http://localhost:3000','http://localhost:3001'],
    credentials: true, // Allow cookies or authorization headers to be sent,
    methods:['GET','POST','PUT','DELETE']
  };
app.use(cors(corsOptions));
app.use(express.json({limit:"50mb"}));
app.use(cookieParser());






app.use("/api/v1/admin/",adminRouter)
app.use("/api/v1/property",propertyRouter)
app.use("/api/v1/city",cityRouter)
app.use("/api/v1/blog",blogRouter)
app.use("/api/v1/banner",bannerRouter)
app.use("/api/v1/developer",developerRouter)
app.use("/api/v1/banner-logo",bannerLogoRouter)
app.use("/api/v1/client-logo",clientLogoRouter)
app.get("/",(req,res)=>{
  req.json({message:"Server is working..."})
})



app.listen(process.env.PORT,()=> {
    connectDataBase();
    console.log(`Server running on PORT : ${process.env.PORT}`) ;
    console.log(`api is : http://localhost:${process.env.PORT}/api/v1`) ;
})


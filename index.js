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
import propertyTypeRouter from "./routes/propertyTypeRouter.js"
import sideBannerRouter from "./routes/sideBannerRouter.js"
import priorityRouter from "./routes/priority.js"
import notificationRouter from "./routes/notification.js"
import agencyRouter from "./routes/agency.js"
import prebuildRouter from "./routes/prebuild.js"

import { connectDataBase } from './connection/index.js';
dotenv.config();

const app = express()


app.use(cors());
app.use(express.json({limit:"50mb",}));
app.use(cookieParser());


app.use("/api/v1",express.static('uploads'))



app.use("/api/v1/admin/",adminRouter)
app.use("/api/v1/property",propertyRouter)
app.use("/api/v1/city",cityRouter)
app.use("/api/v1/blog",blogRouter)
app.use("/api/v1/banner",bannerRouter)
app.use("/api/v1/developer",developerRouter)
app.use("/api/v1/banner-logo",bannerLogoRouter)
app.use("/api/v1/client-logo",clientLogoRouter)
app.use("/api/v1/property-type",propertyTypeRouter)
app.use("/api/v1/sidebar",sideBannerRouter)
app.use("/api/v1/priority",priorityRouter)
app.use("/api/v1/notification",notificationRouter)
app.use("/api/v1/agency",agencyRouter)
app.use("/api/v1/pre-build",prebuildRouter)
app.get("/api/v1/",(req,res)=>{
  res.send(`<h1>Server is Working Fine<h1/>`)
  
})



app.listen(process.env.PORT,()=> {
    connectDataBase();
    console.log(`Server running on PORT : ${process.env.PORT}`) ;
    console.log(`api is : http://localhost:${process.env.PORT}/api/v1`) ;
})


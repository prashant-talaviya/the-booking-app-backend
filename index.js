import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import reservationRoutes from "./routes/reservation.js"
import roomsRoute from "./routes/rooms.js"
import cors from 'cors';
import busesRoute from "./routes/Buses.js";
import flightRoute from "./routes/Flight.js";





import cookieParser from "cookie-parser";
dotenv.config()

const app = express()

const connect=async()=>{
try{
    await mongoose.connect(process.env.MONGO)
    console.log("Connected To MongoDB")
}
catch(error){
    throw error
}
};

mongoose.connection.on("disconnected",()=>{
    console.log("MongoDB is Disconnected !")
})

mongoose.connection.on("connected",()=>{
    console.log("server started")
})

//middlewares
app.use(cookieParser())
app.use(express.json())
app.use(cors());

app.use("/api/auth",authRoute)
app.use("/api/users",usersRoute)
app.use("/api/hotels",hotelsRoute)
app.use("/api/rooms",roomsRoute)
app.use('/api/reservation', reservationRoutes);
app.use("/api/buses", busesRoute);
app.use("/api/flights", flightRoute);



app.use((err,req,res,next)=>{
    const errorStatus=err.status || 500
    const errorMessage=err.message || "Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    });
});

const port=8000
app.listen(port, () => {
    connect();
    console.log(`Connected to backend port at ${port}`)
})
import express from "express";
import Hotel from "../models/Hotel.js"
import { createError } from "../utils/error.js";
import { countByCity, countByType, createHotel, deleteHotel, getHotel, getHotelRooms, getHotels, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin, verifyToken, } from "../utils/verifyToken.js";



const router = express.Router();

//CREATE
router.post("/", createHotel)

//UPDATE
router.put("/:id", updateHotel)


//DELETE
router.delete("/:id", deleteHotel)

//GET
router.get("/find/:id", getHotel)

//GET ALl
router.get("/",getHotels)
router.get("/countByCity", countByCity);
router.get("/countByType", countByType)
router.get("/room/:id", getHotelRooms)

    // const failed = true     in under function          
    // if (failed) { return next(createError(401,"you are not authenticated!")) }

export default router
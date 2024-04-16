import express from "express";
import Reservation from "../models/Reservation.js"
import { createError } from "../utils/error.js";
import {getReservations,getMyBookings,createReservation ,deleteReservation} from "../controllers/reservation.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";



const router = express.Router();

//CREATE Reservation
router.post("/" ,createReservation)



router.get('/mybookings', getMyBookings);

//get all reservations
router.get("/", getReservations)
// DELETE a reservation by ID
router.delete('/:id', deleteReservation);


export default router;
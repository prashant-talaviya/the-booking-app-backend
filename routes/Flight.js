import express from "express";
import { createFlight, bookSeat, searchFlights,getAllFlights ,deleteFlight,updateFlight, getBookedTicketsWithDetails, getTicketsByUsername} from "../controllers/Flight.js";

const router = express.Router();

// POST request to create a new flight
router.post("/create", createFlight);

// POST request to book a seat on a flight
router.post("/:flightId/book", bookSeat);

// GET route for searching flights
router.get("/search", searchFlights);

router.get("/", getAllFlights);


router.delete('/:flightId', deleteFlight);

router.put('/:flightId', updateFlight);


router.get('/booked-tickets', getBookedTicketsWithDetails);
router.get('/tickets-by-username', getTicketsByUsername);


// Uncomment and implement getTicket for flights if needed
// router.get("/getTicket", getTicketForFlight);

export default router;

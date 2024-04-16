import express from "express";
import { createBus, bookSeat, searchBuses,getAllBuses,deleteBus,updateBus,getBookedTicketsWithDetails,getTicketsByUsername,cancelTicket } from "../controllers/bus.js";


const router = express.Router();

// POST request to create a new bus
router.post("/create", createBus);

// POST request to book a seat on a bus
router.post("/:busId/book", bookSeat);

// Add route for searching buses
router.get('/search', searchBuses);

router.get('/', getAllBuses);

router.delete('/:busId', deleteBus);

router.get('/booked-tickets', getBookedTicketsWithDetails);

// Assuming you've imported the function at the top
router.get('/tickets-by-username', getTicketsByUsername);


router.put('/:busId', updateBus);

router.post('/:busId/cancel', cancelTicket);



// router.get("/getTicket", getTicket);

export default router;

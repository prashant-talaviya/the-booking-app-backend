import express from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom, updateRoomAvailability } from "../controllers/room.js";

const router=express.Router();

//CREATE
router.post("/:hotelId",verifyAdmin, createRoom)

//UPDATE
router.put("/:id",verifyAdmin, updateRoom)
router.put("/availability/:id", updateRoomAvailability)


//DELETE
router.delete("/:id/:hotelId",verifyAdmin, deleteRoom)

//GET
router.get("/:id", getRoom)

//GET ALl
router.get("/", getRooms)



export default router
import express from "express";
import { createRoom, getHotelRooms } from "../controllers/roomController.js";
import { clerkAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// The route includes the hotelId parameter to ensure we're always working in the context of a hotel.
router.post("/:hotelId", clerkAuth, createRoom);
router.get("/:hotelId", getHotelRooms);

export default router;

import express from "express";
// This one line imports all three functions we need.
import {
  createHotel,
  getAllHotels,
  getHotelById,
} from "../controllers/hotelController.js";
import { clerkAuth } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// This route uses getAllHotels
router.get("/", getAllHotels);

// This route uses createHotel
router.post("/", clerkAuth, createHotel);

router.post("/", clerkAuth, isAdmin, createHotel);

// This route uses getHotelById
router.get("/:id", getHotelById);

export default router;

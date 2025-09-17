import express from "express";
// Add cancelBooking to this list
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { clerkAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// The order matters. Specific routes like '/my-bookings' should come before dynamic routes like '/:id'.
router.get("/my-bookings", clerkAuth, getMyBookings);
router.post("/", clerkAuth, createBooking);
router.patch("/:id/cancel", clerkAuth, cancelBooking);

export default router;

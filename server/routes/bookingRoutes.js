import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { clerkAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", clerkAuth, createBooking);

export default router;

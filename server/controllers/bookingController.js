import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import { differenceInCalendarDays } from "date-fns";

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guestCount } = req.body;
    const userId = req.auth.userId; // From our clerkAuth middleware

    if (!room || !checkInDate || !checkOutDate || !guestCount) {
      return res
        .status(400)
        .json({ message: "Please provide all booking details." });
    }

    // Find the room to get the price
    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Calculate total price
    const numberOfNights = differenceInCalendarDays(
      new Date(checkOutDate),
      new Date(checkInDate)
    );
    const totalPrice = numberOfNights * roomData.price;

    const newBooking = new Booking({
      user: userId,
      hotel: roomData.hotel,
      room,
      checkInDate,
      checkOutDate,
      guestCount,
      totalPrice,
    });

    const savedBooking = await newBooking.save();

    // TODO: We should also update the room's `unavailableDates` here
    // For now, we'll skip this to keep it simple, but we'll add it later.

    res.status(201).json(savedBooking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during booking", error: error.message });
  }
};

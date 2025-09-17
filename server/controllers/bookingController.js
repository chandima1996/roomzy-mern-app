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

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const bookings = await Booking.find({ user: userId })
      .populate("hotel", "name city images") // Populate with hotel name, city, and images
      .populate("room", "title price") // Populate with room title and price
      .sort({ createdAt: -1 }); // Show the newest bookings first

    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id: bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Security check: Ensure the user cancelling the booking is the one who made it
    if (booking.user.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "Forbidden: You are not authorized to cancel this booking.",
        });
    }

    // Prevent cancelling already cancelled bookings
    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "This booking has already been cancelled." });
    }

    booking.status = "cancelled";
    await booking.save();

    // TODO: Update room's unavailableDates to free up the room. (Advanced)

    res
      .status(200)
      .json({ message: "Booking cancelled successfully.", booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to cancel booking", error: error.message });
  }
};

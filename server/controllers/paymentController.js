import Stripe from "stripe";
import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import { differenceInCalendarDays } from "date-fns";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a payment intent and a temporary booking
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guestCount } = req.body;
    const userId = req.auth.userId;

    // 1. Validate inputs
    if (!room || !checkInDate || !checkOutDate || !guestCount) {
      return res
        .status(400)
        .json({ message: "Missing required booking information." });
    }

    // 2. Calculate total price from the database to ensure price integrity
    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }

    const numberOfNights = differenceInCalendarDays(
      new Date(checkOutDate),
      new Date(checkInDate)
    );
    if (numberOfNights <= 0) {
      return res.status(400).json({ message: "Invalid date range." });
    }
    const totalPrice = numberOfNights * roomData.price;

    // 3. Create a temporary booking with 'pending' status
    const tempBooking = new Booking({
      user: userId,
      hotel: roomData.hotel,
      room,
      checkInDate,
      checkOutDate,
      guestCount,
      totalPrice,
      status: "pending", // IMPORTANT: Booking is not confirmed until payment succeeds
    });
    const savedBooking = await tempBooking.save();

    // 4. Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Stripe expects the amount in the smallest currency unit (e.g., cents)
      currency: "usd",
      metadata: { bookingId: savedBooking._id.toString() }, // Link Stripe payment to our booking
    });

    // 5. Send the client secret back to the frontend
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      bookingId: savedBooking._id,
    });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public (verified by Stripe signature)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.bookingId;

    // Find the booking and update its status to 'confirmed'
    await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });
    console.log(`Booking ${bookingId} confirmed.`);

    // TODO: Send a confirmation email to the user
  }

  res.json({ received: true });
};

import express from "express";
//
import cors from "cors"; //
import connectDB from "./config/db.js";
import { clerkAuth } from "./middleware/authMiddleware.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use("/api/payments/webhook", paymentRoutes);

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Hotel Booking API" });
});

app.get("/api/protected-data", clerkAuth, (req, res) => {
  res.json({
    message: "This is protected data.",
    userId: req.auth.sub,
  });
});

app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

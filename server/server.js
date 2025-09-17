import express from "express";
import dotenv from "dotenv"; //
import cors from "cors"; //
import connectDB from "./config/db.js";
import { clerkAuth } from "./middleware/authMiddleware.js";
dotenv.config();

connectDB();

const app = express();

app.use(cors());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

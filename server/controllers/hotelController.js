import Hotel from "../models/hotelModel.js";

import mongoose from "mongoose";

// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Private (we'll add admin protection later)
export const createHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);

    await hotel.save();

    res.status(201).json(hotel);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating hotel", error: error.message });
  }
};

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
export const getAllHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, starRating } = req.query;

    let filter = {};

    if (city) {
      // Use a case-insensitive regex for searching
      filter.city = { $regex: city, $options: "i" };
    }

    // This is a placeholder for room price, a more complex query would be needed
    // for now we can filter by star rating as a proxy for price/quality
    if (starRating) {
      filter.starRating = { $gte: Number(starRating) }; // gte = greater than or equal
    }

    const hotels = await Hotel.find(filter);
    res.status(200).json(hotels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hotels", error: error.message });
  }
};

// @desc    Get a single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
  try {
    // req.params.id gets the 'id' part from the URL (e.g., /api/hotels/12345)
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hotel ID format" });
    }

    const hotel = await Hotel.findById(id);

    if (hotel) {
      res.status(200).json(hotel);
    } else {
      // If no hotel is found with that ID, send a 404 Not Found error
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hotel", error: error.message });
  }
};

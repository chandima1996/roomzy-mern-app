import Room from "../models/roomModel.js";
import Hotel from "../models/hotelModel.js";

// @desc    Create a new room for a specific hotel
// @route   POST /api/rooms/:hotelId
// @access  Private (Admin)
export const createRoom = async (req, res) => {
  const { hotelId } = req.params; // Get the hotel ID from the URL

  // Create a new room object with data from the request body
  const newRoom = new Room({ ...req.body, hotel: hotelId });

  try {
    const savedRoom = await newRoom.save();

    // After saving the room, we need to add this new room's ID to the parent hotel's 'rooms' array.
    // This is a critical step to maintain the relationship.
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id }, // $push is a MongoDB operator to add an item to an array
    });

    res.status(201).json(savedRoom);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating room", error: error.message });
  }
};

// @desc    Get all rooms for a specific hotel
// @route   GET /api/rooms/:hotelId
// @access  Public
export const getHotelRooms = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const rooms = await Room.find({ hotel: hotelId });
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: error.message });
  }
};
// Note: We'll add update and delete controllers later if needed.

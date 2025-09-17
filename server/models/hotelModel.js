import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A hotel must have a name"],
      trim: true,
    },

    type: {
      type: String,
      required: [true, "A hotel must have a type"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "A hotel must have a city"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "A hotel must have an address"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "A hotel must have a description"],
      trim: true,
    },

    starRating: {
      type: Number,
      required: [true, "A hotel must have a rating"],
      min: 1,
      max: 5,
    },

    images: {
      type: [String],
    },

    amenities: {
      type: [String],
      required: true,
    },

    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],

    owner: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;

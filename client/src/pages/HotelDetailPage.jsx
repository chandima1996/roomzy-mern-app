import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getHotelByIdAPI } from "../services/apiClient";
import { Star, MapPin } from "lucide-react";

const HotelDetailPage = () => {
  const { id } = useParams(); // Get the hotel ID from the URL
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await getHotelByIdAPI(id);
        setHotel(data);
      } catch (err) {
        setError(err.message || "Failed to fetch hotel details.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]); // Re-run the effect if the ID in the URL changes

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) return <div>Loading hotel details...</div>;
  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!hotel) return <div>Hotel not found.</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        <img
          src={hotel.images?.[0] || "https://via.placeholder.com/800x600"}
          alt={hotel.name}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
        {/* Add more images here if available */}
      </div>

      {/* Hotel Info */}
      <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
      <div className="flex items-center mb-4">
        <div className="flex items-center mr-4">
          {renderStars(hotel.starRating)}
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>
            {hotel.address}, {hotel.city}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About this hotel</h2>
        <p className="text-gray-700">{hotel.description}</p>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <span
              key={amenity}
              className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Booking Section - Placeholder */}
      <div className="p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Book your stay</h2>
        <p>Booking calendar and room selection will go here.</p>
      </div>
    </div>
  );
};

export default HotelDetailPage;

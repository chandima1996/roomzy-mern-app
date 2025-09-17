import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelByIdAPI } from "../services/apiClient";
import apiClient from "../services/apiClient";
import { Star, MapPin, Users, DollarSign } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { differenceInCalendarDays } from "date-fns";

// Import our new custom hook for checking admin role
import { useAdmin } from "../hooks/useAdmin";

import AddRoomForm from "../components/admin/AddRoomForm";
import BookingWidget from "../components/BookingWidget";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getHotelRoomsAPI = async (hotelId) => {
  const response = await apiClient.get(`/rooms/${hotelId}`);
  return response.data;
};

const createBookingAPI = async (bookingData, getToken) => {
  const token = await getToken();
  const response = await apiClient.post("/bookings", bookingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const HotelDetailPage = () => {
  const { id: hotelId } = useParams();
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Use our custom hook to determine if the current user is an admin.
  const { isAdmin } = useAdmin();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the central booking widget, controlled by this parent component.
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [guestCount, setGuestCount] = useState(1);

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        setLoading(true);
        const [hotelData, roomsData] = await Promise.all([
          getHotelByIdAPI(hotelId),
          getHotelRoomsAPI(hotelId),
        ]);
        setHotel(hotelData);
        setRooms(roomsData);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotelAndRooms();
  }, [hotelId]);

  const handleRoomAdded = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  const handleReserveClick = async (room) => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    const numberOfNights =
      dateRange.from && dateRange.to
        ? differenceInCalendarDays(dateRange.to, dateRange.from)
        : 0;
    if (numberOfNights <= 0) {
      alert(
        "Please select a valid check-in and check-out date from the booking widget."
      );
      return;
    }

    if (guestCount > room.maxGuests) {
      alert(
        `The number of guests (${guestCount}) exceeds the maximum allowed for this room (${room.maxGuests}).`
      );
      return;
    }

    try {
      const bookingData = {
        room: room._id,
        checkInDate: dateRange.from,
        checkOutDate: dateRange.to,
        guestCount,
      };
      const newBooking = await createBookingAPI(bookingData, getToken);
      alert(
        `Booking successful for "${room.title}"! Your total price is $${newBooking.totalPrice}.`
      );
    } catch (error) {
      console.error("Booking failed:", error);
      alert(`Booking failed: ${error.message}`);
    }
  };

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

  if (loading)
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  if (error)
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  if (!hotel)
    return (
      <div className="container mx-auto p-4 text-center">Hotel not found.</div>
    );

  return (
    <div className="container mx-auto p-4">
      {/* Hotel Info Section */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
        <div className="flex items-center mb-4 flex-wrap">
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
      </div>

      {/* Description Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">About this hotel</h2>
        <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
      </div>

      {/* Amenities Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <span
              key={amenity}
              className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Our Rooms</h2>
          <div className="space-y-6">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <Card key={room._id} className="shadow-lg flex flex-col">
                  <CardHeader>
                    <CardTitle>{room.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 mb-4">{room.description}</p>
                    <div className="flex items-center text-sm space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" /> Max {room.maxGuests}{" "}
                        guests
                      </div>
                      <div className="flex items-center text-lg font-semibold">
                        <DollarSign className="w-5 h-5 mr-1" /> {room.price} /
                        night
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleReserveClick(room)}
                    >
                      Reserve Now
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No rooms have been added for this hotel yet.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingWidget
              onDateChange={setDateRange}
              onGuestsChange={setGuestCount}
              initialDateRange={dateRange}
              initialGuestCount={guestCount}
            />
          </div>
        </div>
      </div>

      {/* Admin Section: Renders ONLY if the user has the 'admin' role in their metadata. */}
      {isAdmin && (
        <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel</h2>
          <div className="flex justify-center">
            <AddRoomForm onRoomAdded={handleRoomAdded} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailPage;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelByIdAPI } from "../services/apiClient";
import apiClient from "../services/apiClient";
import { Star, MapPin, Users, DollarSign } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { differenceInCalendarDays, format } from "date-fns";

// Stripe Imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Custom Component Imports
import { useAdmin } from "../hooks/useAdmin";
import AddRoomForm from "../components/admin/AddRoomForm";
import BookingWidget from "../components/BookingWidget";
import CheckoutForm from "../components/CheckoutForm"; // Stripe's payment form
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Initialize Stripe outside of the component to avoid re-creating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// API Service Functions (can also be in apiClient.js)
const getHotelRoomsAPI = async (hotelId) => {
  const response = await apiClient.get(`/rooms/${hotelId}`);
  return response.data;
};

const createPaymentIntentAPI = async (bookingData, getToken) => {
  const token = await getToken();
  const response = await apiClient.post(
    "/payments/create-payment-intent",
    bookingData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data; // Should return { clientSecret, bookingId }
};

const HotelDetailPage = () => {
  const { id: hotelId } = useParams();
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the central booking widget
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [guestCount, setGuestCount] = useState(1);

  // State for the payment flow
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

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

    setProcessingPayment(true);
    setSelectedRoom(room); // Store the selected room info
    try {
      const bookingData = {
        room: room._id,
        checkInDate: dateRange.from,
        checkOutDate: dateRange.to,
        guestCount,
      };
      const data = await createPaymentIntentAPI(bookingData, getToken);
      setClientSecret(data.clientSecret);
      setCurrentBookingId(data.bookingId);
      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      alert(`Error: ${error.message || "Could not initiate payment."}`);
    } finally {
      setProcessingPayment(false);
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

  const numberOfNights =
    dateRange.from && dateRange.to
      ? differenceInCalendarDays(dateRange.to, dateRange.from)
      : 0;

  return (
    <div className="container mx-auto p-4">
      {/* Hotel Info, Description, Amenities sections remain the same */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Our Rooms</h2>
          <div className="space-y-6">
            {rooms.map((room) => (
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
                    disabled={processingPayment}
                  >
                    {processingPayment ? "Processing..." : "Reserve Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
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

      {isAdmin && (
        <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel</h2>
          <div className="flex justify-center">
            <AddRoomForm onRoomAdded={handleRoomAdded} />
          </div>
        </div>
      )}

      {/* Payment Dialog (Modal) */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm and Pay</DialogTitle>
            <DialogDescription>
              Review your booking details and complete the payment to confirm
              your reservation.
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && numberOfNights > 0 && (
            <div className="py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Room</span>{" "}
                <span className="font-medium">{selectedRoom.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-in</span>{" "}
                <span className="font-medium">
                  {format(dateRange.from, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-out</span>{" "}
                <span className="font-medium">
                  {format(dateRange.to, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Nights</span>{" "}
                <span className="font-medium">{numberOfNights}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                <span className="">Total Price</span>{" "}
                <span>${numberOfNights * selectedRoom.price}</span>
              </div>
            </div>
          )}
          {clientSecret && (
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <CheckoutForm bookingId={currentBookingId} />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelDetailPage;

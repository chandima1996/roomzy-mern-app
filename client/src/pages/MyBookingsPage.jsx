import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { getMyBookingsAPI, cancelBookingAPI } from "../services/apiClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookingsAPI(getToken);
        setBookings(data);
      } catch (err) {
        setError(err.message || "Failed to fetch your bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [getToken]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      await cancelBookingAPI(bookingId, getToken);
      // Update the UI instantly without a page refresh
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      alert("Booking cancelled successfully.");
    } catch (err) {
      alert(`Cancellation failed: ${err.message}`);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading)
    return (
      <div className="container p-4 text-center">Loading your bookings...</div>
    );
  if (error)
    return (
      <div className="container p-4 text-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-600">You haven't made any bookings yet.</p>
          <Button asChild className="mt-4">
            <Link to="/hotels">Explore Hotels</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking._id} className="shadow-md">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle>{booking.hotel.name}</CardTitle>
                  <p className="text-sm text-gray-500">{booking.room.title}</p>
                </div>
                <Badge
                  variant={getStatusBadgeVariant(booking.status)}
                  className="capitalize"
                >
                  {booking.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Check-in</p>
                    <p>
                      {format(
                        new Date(booking.checkInDate),
                        "EEE, MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Check-out</p>
                    <p>
                      {format(
                        new Date(booking.checkOutDate),
                        "EEE, MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Total Price</p>
                    <p>${booking.totalPrice}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {booking.status === "confirmed" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

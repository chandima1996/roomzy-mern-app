// client/src/pages/BookingSuccessPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const BookingSuccessPage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-6">
        Thank you, your payment was successful and your booking is confirmed.
      </p>
      <Button asChild>
        <Link to="/my-bookings">View My Bookings</Link>
      </Button>
    </div>
  );
};
export default BookingSuccessPage;

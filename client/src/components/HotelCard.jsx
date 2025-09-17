import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

const HotelCard = ({ hotel }) => {
  // Simple function to render star icons
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/hotel/${hotel._id}`}>
        <img
          src={
            hotel.images?.[0] ||
            "https://via.placeholder.com/400x250?text=No+Image"
          }
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <CardHeader>
          <CardTitle className="truncate">{hotel.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{hotel.city}</span>
          </div>
          <div className="flex items-center">
            {renderStars(hotel.starRating)}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-lg font-semibold">From $XXX/night</p>{" "}
          {/* Placeholder for price */}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default HotelCard;

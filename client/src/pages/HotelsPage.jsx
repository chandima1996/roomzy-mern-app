import { useState, useEffect } from "react";
import { getAllHotelsAPI } from "../services/apiClient";
import HotelCard from "../components/HotelCard";

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotelsAPI();
        setHotels(data);
      } catch (err) {
        setError(err.message || "Failed to fetch hotels.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Explore Our Hotels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.length > 0 ? (
          hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
        ) : (
          <p>No hotels found.</p>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;

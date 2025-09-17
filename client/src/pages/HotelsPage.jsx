import { useState, useEffect } from "react";
import { getAllHotelsAPI } from "../services/apiClient";
import HotelCard from "../components/HotelCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for our search filters
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHotels = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getAllHotelsAPI(filters);
      setHotels(data);
    } catch (err) {
      setError(err.message || "Failed to fetch hotels.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels({ city: searchTerm });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 p-6 bg-gray-100 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Find your perfect stay</h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <Input
            type="text"
            placeholder="Search by city (e.g., Dubai, London)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.length > 0 ? (
            hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No hotels found matching your criteria.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelsPage;

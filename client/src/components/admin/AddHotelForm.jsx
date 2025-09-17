import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createHotelAPI } from "../../services/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddHotelForm = () => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    type: "Hotel",
    city: "",
    address: "",
    description: "",
    starRating: 3,
    amenities: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hotelData = {
        ...formData,
        starRating: Number(formData.starRating),
        amenities: formData.amenities.split(",").map((item) => item.trim()),
      };

      const newHotel = await createHotelAPI(hotelData, getToken);
      alert(`Hotel "${newHotel.name}" created successfully!`);

      setFormData({
        name: "",
        type: "Hotel",
        city: "",
        address: "",
        description: "",
        starRating: 3,
        amenities: "",
      });
    } catch (error) {
      console.error("Failed to create hotel:", error);
      alert(`Error: ${error.message || "Failed to create hotel"}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add a New Hotel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Hotel Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="starRating">Star Rating (1-5)</Label>
            <Input
              id="starRating"
              name="starRating"
              type="number"
              min="1"
              max="5"
              value={formData.starRating}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Input
              id="amenities"
              name="amenities"
              placeholder="e.g., Free WiFi, Pool, Gym"
              value={formData.amenities}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit">Create Hotel</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddHotelForm;

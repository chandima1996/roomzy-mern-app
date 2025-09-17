import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom"; // To get hotelId from URL
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "../../services/apiClient"; // Assuming default export

// We'll create a dedicated API function for rooms
const createRoomAPI = async (hotelId, roomData, getToken) => {
  const token = await getToken();
  const response = await apiClient.post(`/rooms/${hotelId}`, roomData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const AddRoomForm = ({ onRoomAdded }) => {
  const { id: hotelId } = useParams(); // Get hotelId from the URL, rename it to hotelId
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    maxGuests: "",
    description: "",
    amenities: "", // comma separated
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...formData,
        price: Number(formData.price),
        maxGuests: Number(formData.maxGuests),
        amenities: formData.amenities.split(",").map((item) => item.trim()),
      };
      const newRoom = await createRoomAPI(hotelId, roomData, getToken);
      alert(`Room "${newRoom.title}" added successfully!`);
      if (onRoomAdded) onRoomAdded(newRoom); // Callback to update parent component's state
      // Reset form
      setFormData({
        title: "",
        price: "",
        maxGuests: "",
        description: "",
        amenities: "",
      });
    } catch (error) {
      console.error("Failed to create room:", error);
      alert(`Error: ${error.message || "Failed to create room"}`);
    }
  };

  return (
    <Card className="mt-6 w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add a New Room to This Hotel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Room Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price per Night ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="maxGuests">Max Guests</Label>
            <Input
              id="maxGuests"
              name="maxGuests"
              type="number"
              value={formData.maxGuests}
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
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Input
              id="amenities"
              name="amenities"
              placeholder="e.g., King Bed, Balcony"
              value={formData.amenities}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">Add Room</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddRoomForm;

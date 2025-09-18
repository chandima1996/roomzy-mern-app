import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from '../../services/apiClient';

// Dedicated API function to create a hotel
const createHotelAPI = async (hotelData, getToken) => {
    try {
        const token = await getToken();
        const response = await apiClient.post('/hotels', hotelData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: error.message };
    }
};

const AddHotelForm = () => {
    const { getToken } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Hotel',
        city: '',
        address: '',
        description: '',
        starRating: 3,
        amenities: '', // Will be a comma-separated string
    });
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        const uploadedImageUrls = [];

        for (const file of files) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            try {
                // The '/upload' endpoint receives the image, sends it to Cloudinary,
                // and returns the public URL.
                const res = await apiClient.post('/upload', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedImageUrls.push(res.data.imageUrl);
            } catch (err) {
                console.error('Image upload failed:', err);
                alert('An error occurred during image upload. Please try again.');
            }
        }
        
        // Add new URLs to the existing list of images
        setImages(prev => [...prev, ...uploadedImageUrls]);
        setIsUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) {
            alert('Please upload at least one image for the hotel.');
            return;
        }
        setIsSubmitting(true);
        try {
            const hotelData = {
                ...formData,
                starRating: Number(formData.starRating),
                amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean),
                images: images, // Add the array of uploaded image URLs
            };

            const newHotel = await createHotelAPI(hotelData, getToken);
            alert(`Hotel "${newHotel.name}" created successfully!`);
            
            // Reset the form completely
            setFormData({ name: '', type: 'Hotel', city: '', address: '', description: '', starRating: 3, amenities: '' });
            setImages([]);
        } catch (error) {
            console.error('Failed to create hotel:', error);
            alert(`Error: ${error.message || 'Failed to create hotel'}`);
        } finally {
            setIsSubmitting(false);
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
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="starRating">Star Rating (1-5)</Label>
                        <Input id="starRating" name="starRating" type="number" min="1" max="5" value={formData.starRating} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <Input id="amenities" name="amenities" placeholder="e.g., Free WiFi, Pool, Gym" value={formData.amenities} onChange={handleChange} required />
                    </div>
                    
                    {/* Image Upload Section */}
                    <div>
                        <Label htmlFor="images">Hotel Images</Label>
                        <Input id="images" name="images" type="file" multiple onChange={handleImageUpload} accept="image/png, image/jpeg" disabled={isUploading} />
                        {isUploading && <p className="text-sm text-blue-600 mt-2">Uploading images, please wait...</p>}
                    </div>

                    {/* Image Preview Section */}
                    {images.length > 0 && (
                        <div>
                            <Label>Image Previews</Label>
                            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {images.map((url) => (
                                    <div key={url} className="relative">
                                        <img 
                                            src={url} 
                                            alt="Hotel upload preview" 
                                            className="w-full h-24 object-cover rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <Button type="submit" disabled={isSubmitting || isUploading}>
                        {isSubmitting ? 'Creating Hotel...' : 'Create Hotel'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddHotelForm;
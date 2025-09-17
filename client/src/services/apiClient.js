import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

apiClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// client/src/services/apiClient.js

export const createHotelAPI = async (hotelData, getToken) => {
  try {
    const token = await getToken();
    console.log("Frontend Token:", token);

    if (!token) {
      throw new Error("Clerk token not found!");
    }

    const response = await apiClient.post("/hotels", hotelData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getAllHotelsAPI = async (filters = {}) => {
  try {
    // URLSearchParams is a built-in browser API to easily build query strings
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/hotels?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Function to get a single hotel by its ID
export const getHotelByIdAPI = async (hotelId) => {
  try {
    const response = await apiClient.get(`/hotels/${hotelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
export const getMyBookingsAPI = async (getToken) => {
  const token = await getToken();
  const response = await apiClient.get("/bookings/my-bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const cancelBookingAPI = async (bookingId, getToken) => {
  const token = await getToken();
  const response = await apiClient.patch(
    `/bookings/${bookingId}/cancel`,
    {},
    {
      // Empty object for the body
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export default apiClient;

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

export const getAllHotelsAPI = async () => {
  try {
    const response = await apiClient.get("/hotels");
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

export default apiClient;

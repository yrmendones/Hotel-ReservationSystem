import api from './api';

const hotelService = {
    // Get all hotels with optional filters
    getHotels: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await api.get(`/hotels?${params.toString()}`);
        return response.data;
    },

    // Get hotel by ID
    getHotelById: async (id) => {
        const response = await api.get(`/hotels/${id}`);
        return response.data;
    },

    // Create new hotel (admin only)
    createHotel: async (hotelData) => {
        const response = await api.post('/hotels', hotelData);
        return response.data;
    },

    // Update hotel (admin only)
    updateHotel: async (id, hotelData) => {
        const response = await api.put(`/hotels/${id}`, hotelData);
        return response.data;
    },

    // Delete hotel (admin only)
    deleteHotel: async (id) => {
        const response = await api.delete(`/hotels/${id}`);
        return response.data;
    },

    // Get hotel rooms
    getHotelRooms: async (hotelId, filters = {}) => {
        const params = new URLSearchParams({ hotel: hotelId });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await api.get(`/rooms?${params.toString()}`);
        return response.data;
    },

    // Get available rooms for dates
    getAvailableRooms: async (hotelId, checkIn, checkOut, filters = {}) => {
        const params = new URLSearchParams({
            hotel: hotelId,
            checkIn,
            checkOut,
            isAvailable: true,
            ...filters
        });
        const response = await api.get(`/rooms?${params.toString()}`);
        return response.data;
    }
};

export default hotelService; 
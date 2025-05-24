import api from './api';

const bookingService = {
    // Get all bookings (filtered by user or admin)
    getBookings: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await api.get(`/bookings?${params.toString()}`);
        return response.data;
    },

    // Get booking by ID
    getBookingById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    // Create new booking
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Update booking status
    updateBookingStatus: async (id, status, cancellationReason = '') => {
        const response = await api.patch(`/bookings/${id}/status`, {
            status,
            cancellationReason
        });
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (id, reason) => {
        return bookingService.updateBookingStatus(id, 'cancelled', reason);
    },

    // Get user's bookings
    getUserBookings: async (filters = {}) => {
        const response = await api.get('/bookings', { params: filters });
        return response.data;
    },

    // Get booking history
    getBookingHistory: async (filters = {}) => {
        const params = new URLSearchParams({
            ...filters,
            status: ['completed', 'cancelled'].join(',')
        });
        const response = await api.get(`/bookings?${params.toString()}`);
        return response.data;
    },

    // Get upcoming bookings
    getUpcomingBookings: async (filters = {}) => {
        const params = new URLSearchParams({
            ...filters,
            status: ['pending', 'confirmed'].join(','),
            startDate: new Date().toISOString()
        });
        const response = await api.get(`/bookings?${params.toString()}`);
        return response.data;
    }
};

export default bookingService; 
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    amenities: [{
        type: String
    }],
    images: [{
        type: String
    }],
    contactInfo: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    checkInTime: {
        type: String,
        required: true,
        default: '14:00'
    },
    checkOutTime: {
        type: String,
        required: true,
        default: '12:00'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for location-based queries
hotelSchema.index({ 'address.city': 1, 'address.country': 1 });

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel; 
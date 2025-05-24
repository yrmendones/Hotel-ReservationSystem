const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Single', 'Double', 'Twin', 'Queen', 'King', 'Suite']
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    amenities: [{
        type: String
    }],
    images: [{
        type: String
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    floor: {
        type: Number,
        required: true
    },
    size: {
        type: Number, // in square meters
        required: true
    },
    bedType: {
        type: String,
        required: true,
        enum: ['Single', 'Double', 'Queen', 'King']
    },
    view: {
        type: String,
        enum: ['City', 'Ocean', 'Garden', 'Mountain', 'Pool']
    }
}, {
    timestamps: true
});

// Compound index for hotel and room number
roomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room; 
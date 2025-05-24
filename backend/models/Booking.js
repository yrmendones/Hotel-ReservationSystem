const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        adults: {
            type: Number,
            required: true,
            min: 1
        },
        children: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    specialRequests: {
        type: String
    },
    cancellationReason: {
        type: String
    }
}, {
    timestamps: true
});

// Index for date-based queries
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, status: 1 });

// Validate check-out date is after check-in date
bookingSchema.pre('save', function(next) {
    if (this.checkOut <= this.checkIn) {
        next(new Error('Check-out date must be after check-in date'));
    }
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 
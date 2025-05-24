const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { auth } = require('../middleware/auth');

// Validation middleware
const bookingValidation = [
    body('hotel').isMongoId().withMessage('Valid hotel ID is required'),
    body('room').isMongoId().withMessage('Valid room ID is required'),
    body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
    body('guests.adults').isInt({ min: 1 }).withMessage('At least one adult guest is required'),
    body('guests.children').optional().isInt({ min: 0 }).withMessage('Children count must be non-negative'),
    body('specialRequests').optional().trim()
];

// Get all bookings (filtered by user or admin)
router.get('/', auth, async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user._id };
        const { status, startDate, endDate } = req.query;

        if (status) query.status = status;
        if (startDate || endDate) {
            query.checkIn = {};
            if (startDate) query.checkIn.$gte = new Date(startDate);
            if (endDate) query.checkIn.$lte = new Date(endDate);
        }

        const bookings = await Booking.find(query)
            .populate('user', 'name email')
            .populate('hotel', 'name address')
            .populate('room', 'roomNumber type price')
            .select('-__v')
            .sort({ checkIn: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('hotel', 'name address')
            .populate('room', 'roomNumber type price amenities');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to view this booking
        if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new booking
router.post('/', [auth, bookingValidation], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { hotel, room, checkIn, checkOut, guests } = req.body;

        // Check if room exists and belongs to the hotel
        const roomDoc = await Room.findOne({ _id: room, hotel });
        if (!roomDoc) {
            return res.status(400).json({ message: 'Invalid room or hotel' });
        }

        // Check if room is available for the selected dates
        const existingBooking = await Booking.findOne({
            room,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    checkIn: { $lte: new Date(checkOut) },
                    checkOut: { $gte: new Date(checkIn) }
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Room is not available for the selected dates' });
        }

        // Calculate total price
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        const totalPrice = roomDoc.price * nights;

        const booking = new Booking({
            ...req.body,
            user: req.user._id,
            totalPrice
        });

        await booking.save();

        // Populate the booking details
        await booking.populate([
            { path: 'user', select: 'name email' },
            { path: 'hotel', select: 'name address' },
            { path: 'room', select: 'roomNumber type price' }
        ]);

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status, cancellationReason } = req.body;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to update this booking
        if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        // Only allow cancellation by user, other status changes by admin
        if (status === 'cancelled') {
            if (req.user.role !== 'admin') {
                booking.cancellationReason = cancellationReason;
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can update booking status' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete booking (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only admin can delete bookings
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete bookings' });
        }

        await booking.remove();
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
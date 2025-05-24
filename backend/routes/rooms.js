const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const { auth, adminAuth } = require('../middleware/auth');

// Validation middleware
const roomValidation = [
    body('hotel').isMongoId().withMessage('Valid hotel ID is required'),
    body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
    body('type').isIn(['Single', 'Double', 'Twin', 'Queen', 'King', 'Suite'])
        .withMessage('Invalid room type'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('floor').isInt({ min: 0 }).withMessage('Floor must be a non-negative number'),
    body('size').isFloat({ min: 0 }).withMessage('Size must be a positive number'),
    body('bedType').isIn(['Single', 'Double', 'Queen', 'King'])
        .withMessage('Invalid bed type'),
    body('amenities').optional().isArray(),
    body('images').optional().isArray()
];

// Get all rooms (with filters)
router.get('/', async (req, res) => {
    try {
        const {
            hotel,
            type,
            minPrice,
            maxPrice,
            capacity,
            bedType,
            isAvailable
        } = req.query;

        const query = {};

        if (hotel) query.hotel = hotel;
        if (type) query.type = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (capacity) query.capacity = { $gte: Number(capacity) };
        if (bedType) query.bedType = bedType;
        if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

        const rooms = await Room.find(query)
            .populate('hotel', 'name address')
            .select('-__v')
            .sort({ price: 1 });

        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get room by ID
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('hotel', 'name address')
            .select('-__v');

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new room (admin only)
router.post('/', [auth, adminAuth, roomValidation], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if hotel exists
        const hotel = await Hotel.findById(req.body.hotel);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Check if room number already exists in the hotel
        const existingRoom = await Room.findOne({
            hotel: req.body.hotel,
            roomNumber: req.body.roomNumber
        });

        if (existingRoom) {
            return res.status(400).json({ message: 'Room number already exists in this hotel' });
        }

        const room = new Room(req.body);
        await room.save();

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update room (admin only)
router.put('/:id', [auth, adminAuth, roomValidation], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if room number is being changed
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        if (room.roomNumber !== req.body.roomNumber) {
            // Check if new room number already exists in the hotel
            const existingRoom = await Room.findOne({
                hotel: req.body.hotel,
                roomNumber: req.body.roomNumber,
                _id: { $ne: req.params.id }
            });

            if (existingRoom) {
                return res.status(400).json({ message: 'Room number already exists in this hotel' });
            }
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedRoom);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete room (admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
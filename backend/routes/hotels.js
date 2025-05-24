const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Hotel = require('../models/Hotel');
const { auth, adminAuth } = require('../middleware/auth');

// Validation middleware
const hotelValidation = [
    body('name').trim().notEmpty().withMessage('Hotel name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('address.street').trim().notEmpty().withMessage('Street address is required'),
    body('address.city').trim().notEmpty().withMessage('City is required'),
    body('address.state').trim().notEmpty().withMessage('State is required'),
    body('address.country').trim().notEmpty().withMessage('Country is required'),
    body('address.zipCode').trim().notEmpty().withMessage('Zip code is required'),
    body('contactInfo.phone').trim().notEmpty().withMessage('Phone number is required'),
    body('contactInfo.email').isEmail().withMessage('Please enter a valid email'),
    body('amenities').optional().isArray(),
    body('images').optional().isArray()
];

// Get all hotels
router.get('/', async (req, res) => {
    try {
        const { city, country, minRating, amenities } = req.query;
        const query = { isActive: true };

        if (city) query['address.city'] = new RegExp(city, 'i');
        if (country) query['address.country'] = new RegExp(country, 'i');
        if (minRating) query.rating = { $gte: Number(minRating) };
        if (amenities) {
            const amenityList = amenities.split(',');
            query.amenities = { $all: amenityList };
        }

        const hotels = await Hotel.find(query)
            .select('-__v')
            .sort({ rating: -1 });

        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get hotel by ID
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
            .select('-__v')
            .populate('rooms');

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new hotel (admin only)
router.post('/', [auth, adminAuth, hotelValidation], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const hotel = new Hotel(req.body);
        await hotel.save();

        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update hotel (admin only)
router.put('/:id', [auth, adminAuth, hotelValidation], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete hotel (admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
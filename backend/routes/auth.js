const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Create a new booking (protected route)
router.post('/', auth, async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;
  try {
    // Check if the room exists and is available
    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Create the booking
    const booking = new Booking({
      userId: req.user.id, // From auth middleware
      roomId,
      checkInDate,
      checkOutDate,
      status: 'confirmed'
    });
    await booking.save();

    // Update room availability
    room.isAvailable = false;
    await room.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('roomId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
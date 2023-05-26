const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');
const router = express.Router();


// PUT /bookings/:id - Update and return an existing booking
router.put('/:id', requireAuth, async (req, res) => {
    const bookingId = parseInt(req.params.id, 10);
    const { startDate, endDate } = req.body;

    // Fetch the booking to be updated
    const booking = await Booking.findByPk(bookingId);

    // Check if booking exists
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        });
    }

    // Check if current user is the owner of the booking
    if (booking.userId !== req.user.id) {
        return res.status(403).json({
            message: "You don't have permission to edit this booking"
        });
    }

    // Check if endDate is before startDate
    if (new Date(endDate) < new Date(startDate)) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot come before startDate"
            },
        });
    }

    // Check if the booking is in the past
    if (new Date(booking.endDate) < new Date()) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        });
    }

    // Find bookings that overlap with the new start and end dates
    const overlappingBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id: {
                [Op.ne]: bookingId
            },
            [Op.or]: [
                { startDate: { [Op.between]: [startDate, endDate] } },
                { endDate: { [Op.between]: [startDate, endDate] } }
            ]
        }
    });

    // If there are overlapping bookings, return an error
    if (overlappingBookings.length > 0) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            },
        });
    }

    // Update the booking
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    // Send the updated booking as a response
    return res.status(200).json(booking);
});

// DELETE /bookings/:bookingId - Delete an existing booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = parseInt(req.params.bookingId, 10);

    // Check if the user is logged in
    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    try {
        // Fetch the booking to be deleted
        const booking = await Booking.findByPk(bookingId);

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({
                message: "Booking couldn't be found"
            });
        }

        // Check if the booking belongs to the current user or the Spot belongs to the current user
        const spot = await Spot.findOne({ where: { id: booking.spotId }});
        if (booking.userId !== req.user.id && spot.userId !== req.user.id) {
            return res.status(403).json({
                message: "You don't have permission to delete this booking"
            });
        }

        // Check if the booking has started
        if (new Date(booking.startDate) <= new Date()) {
            return res.status(403).json({
                message: "Bookings that have been started can't be deleted"
            });
        }

        // Delete the booking
        await booking.destroy();

        // Send the successful response
        return res.status(200).json({
            message: "Successfully deleted"
        });
    } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});




module.exports = router;

const express = require('express');
const { Op, literal } = require('sequelize');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { Spot, Review, sequelize, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const models = require('../../db/models'); // adjust the path to point to your models directory
// GET /spots - Retrieve all spots with average rating

router.get('/', async (req, res, next) => {
  try {
    // Retrieve all spots from the database
    const spots = await Spot.findAll({
      attributes: [
        'id',
        'ownerId',
        'address',
        'city',
        'state',
        'country',
        'lat',
        'lng',
        'name',
        'description',
        'price',
        'createdAt',
        'updatedAt',
      ],
    });

    // Prepare the response data
    const spotData = await Promise.all(spots.map(async (spot) => {
      const previewImage = await Image.findOne({
        where: {
          indexType: 'Spot',
          indexId: spot.id,
          previewImage: true,
        },
      });

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        previewImage: previewImage ? previewImage.url : null,
      };
    }));

    // Send the successful response with the spot data
    return res.json({ Spots: spotData });
  } catch (error) {
    // Handle any errors that occur during the request
    return next(error);
  }
});




// Get all Spots owned by the Current User
router.get('/user', requireAuth, async (req, res) => {
  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  try {
    const userId = req.user.id;

    const spots = await Spot.findAll({
      where: { ownerId: userId },
      attributes: [
        'id',
        'ownerId',
        'address',
        'city',
        'state',
        'country',
        'lat',
        'lng',
        'name',
        'description',
        'price',
        'createdAt',
        'updatedAt'
      ]
    });

    // Check if any spots were found
    if (spots.length === 0) {
      return res.status(404).json({
        message: 'No spots found for this user'
      });
    }

    // Prepare the response data
    const spotData = await Promise.all(spots.map(async (spot) => {
      // Load the reviews for this spot
      const reviews = await spot.getReviews();
      
      // Calculate the average rating
      let avgRating = 0;
      if (reviews.length > 0) {
        const totalStars = reviews.reduce((total, review) => total + review.stars, 0);
        avgRating = totalStars / reviews.length;
      }

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: parseFloat(avgRating || 0), // Default to 0 if avgRating is null
      };
    }));

    return res.status(200).json({
      Spots: spotData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});



// POST /spots - Create a new spot
router.post('/', requireAuth, [
  // Validate input data
  check('address').isLength({ min: 1 }).withMessage('Street address is required'),
  check('city').isLength({ min: 1 }).withMessage('City is required'),
  check('state').isLength({ min: 1 }).withMessage('State is required'),
  check('country').isLength({ min: 1 }).withMessage('Country is required'),
  check('lat').isNumeric().withMessage('Latitude is not valid'),
  check('lng').isNumeric().withMessage('Longitude is not valid'),
  check('name').isLength({ min: 1, max: 50 }).withMessage('Name must be less than 50 characters'),
  check('description').isLength({ min: 1 }).withMessage('Description is required'),
  check('price').isNumeric().withMessage('Price per day is required'),
], handleValidationErrors, async (req, res) => {
  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  try {
    const userId = req.user.id;

    // Create the new spot
    const spot = await Spot.create({
      ownerId: userId,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      lat: req.body.lat,
      lng: req.body.lng,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });

    // Respond with the newly created spot
    return res.status(201).json({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});


// PUT /spots/:id - Edit a spot
router.get('/:id', async (req, res) => {
  const spotId = req.params.id;
  try {
    const spot = await models.Spot.findOne({
      where: {
        id: spotId
      }
    });
    if (!spot) {
      res.status(404).json({ error: 'Spot not found' });
      return;
    }

    const owner = await models.User.findOne({
      where: {
        id: spot.ownerId
      }
    });

    const images = await models.Image.findAll({
      where: {
        indexId: spot.id,
        indexType: 'Spot'
      }
    });

    const reviews = await models.Review.findAll({
      where: {
        spotId: spotId
      }
    });

    let totalStars = 0;
    reviews.forEach(review => {
      totalStars += review.stars;
    });

    const avgStarRating = totalStars / reviews.length;

    const response = {
      ...spot.toJSON(),
      Owner: owner,
      SpotImages: images,
      numReviews: reviews.length,
      avgStarRating: avgStarRating
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST /spots/:id/images - Add an Image to a Spot based on the Spot's id
router.post('/:id/images', requireAuth, async (req, res) => {
  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  try {
    const spotId = req.params.id;
    const userId = req.user.id;
    const { url, preview } = req.body;

    // Retrieve the spot with the provided ID
    const spot = await Spot.findByPk(spotId);

    // If the spot doesn't exist, return an error
    if (!spot) {
      return res.status(404).json({
        message: 'Spot couldn\'t be found',
      });
    }

    // If the spot's owner isn't the current user, return an error
    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    // Create the new Image
    const image = await Image.create({
      url,
      preview,
      indexId: spotId,
      indexType: 'Spot',
    });

    // Respond with the newly created image
    return res.status(200).json({
      id: image.id,
      url: image.url,
      preview: image.preview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});


// DELETE /spots/:id - Delete a Spot
router.delete('/:id', requireAuth, async (req, res) => {
  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  try {
    const spotId = req.params.id;
    const userId = req.user.id;

    // Retrieve the spot with the provided ID
    const spot = await Spot.findByPk(spotId);

    // If the spot doesn't exist, return an error
    if (!spot) {
      return res.status(404).json({
        message: 'Spot couldn\'t be found',
      });
    }

    // If the spot's owner isn't the current user, return an error
    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    // Delete the spot
    await spot.destroy();

    // Respond with a success message
    return res.status(200).json({
      message: 'Successfully deleted',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});



// GET /spots/:spotId/bookings - Get all bookings for a spot
router.get('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  // Extracting the spotId from the request parameters and converting it to a number
  const spotId = parseInt(req.params.spotId, 10);

  // Trying to find a Spot with the extracted id
  const spot = await Spot.findByPk(spotId);

  // If the Spot does not exist, return a 404 error
  if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Find all bookings for this spot
  const spotBookings = await Booking.findAll({
      where: { spotId },
  });

  // If the current user is not the owner of the spot, only return basic booking data
  if (req.user.id !== spot.ownerId) {
      return res.json({
          Bookings: spotBookings.map(booking => ({
              spotId: booking.spotId,
              startDate: booking.startDate,
              endDate: booking.endDate,
          })),
      });
  }

  // If the current user is the owner of the spot, fetch the associated User data for each booking and return it
  for (let booking of spotBookings) {
      booking.User = await User.findByPk(booking.userId);
  }

  // Return the Bookings with their associated User data (if the current user is the owner of the spot)
  res.json({ Bookings: spotBookings });
});




// POST /spots/:spotid/bookings - Create a booking from a spot
router.post('/:spotid/bookings', requireAuth, async (req, res) => {
  const spotId = parseInt(req.params.spotid, 10);
  const { startDate, endDate } = req.body;

  // Fetch the spot
  const spot = await Spot.findByPk(spotId);

  // Check if spot exists
  if (!spot) {
      return res.status(404).json({
          message: "Spot couldn't be found"
      });
  }

  // Check if current user is the owner of the spot
  if (spot.userId === req.user.id) {
      return res.status(403).json({
          message: "You can't book your own spot"
      });
  }

  // Check if endDate is on or before startDate
  if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
          message: "Bad Request",
          errors: {
              endDate: "endDate cannot be on or before startDate"
          },
      });
  }

  // Find bookings that overlap with the new start and end dates
  const overlappingBookings = await Booking.findAll({
      where: {
          spotId: spotId,
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

  // Create the new booking
  const newBooking = await Booking.create({
      spotId: spotId,
      userId: req.user.id,
      startDate: startDate,
      endDate: endDate
  });

  // Send the successful response with the new booking data
  return res.status(200).json(newBooking);
});


// GET /spots - Return spots filtered by query parameters
router.get('/', async (req, res) => {
  const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // Validate query parameters
  const errors = {};

  // Validate page
  if (page < 1 || page > 10) {
    errors.page = 'Page must be between 1 and 10';
  }

  // Validate size
  if (size < 1 || size > 20) {
    errors.size = 'Size must be between 1 and 20';
  }

  // Validate latitude and longitude
  if (minLat && isNaN(minLat)) {
    errors.minLat = 'Minimum latitude is invalid';
  }
  if (maxLat && isNaN(maxLat)) {
    errors.maxLat = 'Maximum latitude is invalid';
  }
  if (minLng && isNaN(minLng)) {
    errors.minLng = 'Minimum longitude is invalid';
  }
  if (maxLng && isNaN(maxLng)) {
    errors.maxLng = 'Maximum longitude is invalid';
  }

  // Validate price
  if (minPrice && isNaN(minPrice)) {
    errors.minPrice = 'Minimum price is invalid';
  }
  if (maxPrice && isNaN(maxPrice)) {
    errors.maxPrice = 'Maximum price is invalid';
  }

  // If there are validation errors, return a 400 Bad Request response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: errors
    });
  }

  try {
    // Set up filter object based on query parameters
    const filter = {};

    if (minLat && maxLat) {
      filter.lat = {
        [Op.between]: [minLat, maxLat]
      };
    }

    if (minLng && maxLng) {
      filter.lng = {
        [Op.between]: [minLng, maxLng]
      };
    }

    if (minPrice && maxPrice) {
      filter.price = {
        [Op.between]: [minPrice, maxPrice]
      };
    }

    // Fetch spots based on the filter
    const spots = await Spot.findAll({
      where: filter,
      offset: (page - 1) * size,
      limit: size
    });

    // Prepare the response data
    const responseData = {
      Spots: spots,
      page: parseInt(page, 10),
      size: parseInt(size, 10)
    };

    // Send the successful response with the spots data
    return res.status(200).json(responseData);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});



module.exports = router;

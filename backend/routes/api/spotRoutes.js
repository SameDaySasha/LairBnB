const express = require('express');
const { Op, literal } = require('sequelize');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { Spot, Review, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
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
        'updatedAt'
      ]
    });

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

    // Send the successful response with the spot data
    return res.json(spotData);
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
  check('address').isLength({ min: 1 }).withMessage('Address is required'),
  check('city').isLength({ min: 1 }).withMessage('City is required'),
  check('state').isLength({ min: 1 }).withMessage('State is required'),
  check('country').isLength({ min: 1 }).withMessage('Country is required'),
  check('lat').isNumeric().withMessage('Latitude must be a number'),
  check('lng').isNumeric().withMessage('Longitude must be a number'),
  check('name').isLength({ min: 1 }).withMessage('Name is required'),
  check('description').isLength({ min: 1 }).withMessage('Description is required'),
  check('price').isNumeric().withMessage('Price must be a number'),
], async (req, res) => {
  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
router.put('/:id', requireAuth, async (req, res, next) => {
  // Extract the ID of the spot from the request parameters
  const spotId = req.params.id;

  // Extract the new spot data from the request body
  const {
    address, 
    city, 
    state, 
    country, 
    lat, 
    lng, 
    name, 
    description, 
    price
  } = req.body;

  try {
    // Retrieve the spot from the database
    const spot = await Spot.findByPk(spotId);

    // Check if the spot exists
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    // Check if the user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update the spot in the database
    await spot.update({
      address, 
      city, 
      state, 
      country, 
      lat, 
      lng, 
      name, 
      description, 
      price,
      updatedAt: new Date()
    });

    // Send the updated spot data as the response
    return res.json({
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
      updatedAt: spot.updatedAt
    });
  } catch (error) {
    // Handle any errors that occur during the request
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: error.errors.map(e => e.message)
      });
    } else {
      return next(error);
    }
  }
});


// GET /spots/:id - Retrieve spot by id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    // Retrieve the spot from the database
    const spot = await Spot.findByPk(id);

    // Handle spot not found
    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
      });
    }

    // Load the associated data for this spot
    const reviews = await spot.getReviews();
    const images = await spot.getSpotImages();
    const owner = await spot.getOwner();

    // Calculate the average rating and number of reviews
    let avgRating = 0;
    const numReviews = reviews.length;
    if (numReviews > 0) {
      const totalStars = reviews.reduce((total, review) => total + review.stars, 0);
      avgRating = totalStars / numReviews;
    }

    // Prepare the response data
    const spotData = {
      spot,
      avgRating: parseFloat(avgRating || 0), // Default to 0 if avgRating is null
      numReviews: numReviews,
      spotImages: images.map(image => ({
        id: image.id,
        url: image.url,
      })),
      owner: {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
      },
    };

    // Send the successful response with the spot data
    return res.json(spotData);
  } catch (error) {
    // Handle any errors that occur during the request
    return next(error);
  }
});









module.exports = router;

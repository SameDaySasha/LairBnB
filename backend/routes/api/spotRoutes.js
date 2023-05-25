const express = require('express');
const { Op, literal } = require('sequelize');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { Spot, Review, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
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

// add image to spot via spot id 
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




module.exports = router;

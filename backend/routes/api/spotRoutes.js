const express = require('express');
const { Op, literal } = require('sequelize');
const router = express.Router();
const { Spot, Review, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
// GET /spots - Retrieve all spots with average rating
router.get('/', async (req, res, next) => {
  try {
    // Retrieve all spots from the database along with their average rating
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
        [sequelize.fn('AVG', sequelize.col('reviews.stars')), 'avgRating'],
      ],
      include: [
        {
          model: Review,
          attributes: [],
        },
      ],
      group: ['Spot.id'], // Group by Spot.id to calculate average per spot
    });

    // Prepare the response data
    const spotData = spots.map((spot) => ({
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
      avgRating: parseFloat(spot.dataValues.avgRating || 0), // Default to 0 if avgRating is null
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
        'updatedAt',
        [sequelize.fn('AVG', sequelize.col('reviews.stars')), 'avgRating'],
      ],
      include: [ // image preview goes here
        {
          model: Review,
          attributes: [],
        },
      ],
      group: ['Spot.id'], // Group by Spot.id to calculate average per spot
    });

    // Check if any spots were found
    if (spots.length === 0) {
      return res.status(404).json({
        message: 'No spots found for this user'
      });
    }

    // Prepare the response data
    const spotData = spots.map((spot) => ({
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
      avgRating: parseFloat(spot.dataValues.avgRating || 0), // Default to 0 if avgRating is null
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
module.exports = router;

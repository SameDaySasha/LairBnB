const express = require('express');
const { Op, literal } = require('sequelize');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { Spot, Review, sequelize, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const models = require('../../db/models'); // adjust the path to point to your models directory


// frankestein mosnter of the two comented out routes smushed together 
router.get('/', async (req, res, next) => {
  try {
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
        previewImage: previewImage ? previewImage.url : null,
        avgRating: parseFloat(avgRating || 0), // Default to 0 if avgRating is null
      };
    }));

    // Send the successful response with the spot data
    return res.status(200).json({
      Spots: spotData,
      page: parseInt(page, 10),
      size: parseInt(size, 10),
    });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// GET all reviews by a spot's ID
router.get('/:id/reviews', requireAuth, async (req, res, next) => {
  // Extracting the id from the request parameters and converting it to a number
  const spotId = parseInt(req.params.id, 10);

  // Trying to find a Spot with the extracted id
  const spot = await Spot.findByPk(spotId);

  // If the Spot does not exist, return a 404 error
  if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // If the Spot does exist, find all Reviews that belong to this Spot.
  const reviews = await Review.findAll({
      where: { spotId },
  });

  // For each Review, fetch the associated User and ReviewImage data in separate queries.
  // This might be less efficient but avoids eager loading.
  for (let review of reviews) {
      review.User = await User.findByPk(review.userId);
      review.ReviewImages = await ReviewImage.findAll({ where: { reviewId: review.id } });
  }

  // Return the Reviews with their associated User and ReviewImage data.
  res.json({ Reviews: reviews });
});

// POST /spots/:id/reviews - Create a new review for a spot specified by id
router.post('/:id/reviews', requireAuth, async (req, res, next) => {
  // Check if the user is logged in
  if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
  }

  // Extract the spot id from the request parameters
  const spotId = parseInt(req.params.id, 10);

  // Extract the review and stars from the request body
  const { review, stars } = req.body;

  // Validate the review and stars
  if (!review || typeof review !== 'string' || review.length === 0) {
      return res.status(400).json({ message: 'Bad Request', errors: { review: 'Review text is required' } });
  }
  if (!stars || typeof stars !== 'number' || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Bad Request', errors: { stars: 'Stars must be an integer from 1 to 5' } });
  }

  try {
      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
          return res.status(404).json({ message: 'Spot couldn\'t be found' });
      }

      // Check if the user already has a review for this spot
      const existingReview = await Review.findOne({ where: { spotId, userId: req.user.id } });
      if (existingReview) {
          return res.status(403).json({ message: 'User already has a review for this spot' });
      }

      // Create the new review
      const newReview = await Review.create({
          userId: req.user.id,
          spotId,
          review,
          stars
      });

      // Return the successful response
      return res.status(201).json(newReview.get({ plain: true }));
  } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
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


// GET /spots/:id - Get a spot by ID
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

// PUT /spots/:id - Edit a spot
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const spotId = req.params.id;
    const userId = req.user.id;

    // Find the spot to be updated
    const spot = await Spot.findOne({
      where: {
        id: spotId,
        ownerId: userId,
      },
    });

    // Check if the spot exists and belongs to the current user
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    // Update the spot with the new data
    await spot.update({
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

    // Fetch the updated spot from the database
    const updatedSpot = await Spot.findOne({
      where: {
        id: spotId,
      },
    });

    // Send the successful response with the updated spot data
    return res.status(200).json(updatedSpot);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});






// POST /spots/:id/images - Add an Image to a Spot based on the Spot's id
router.post('/:id/images', requireAuth, [
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a URL for the image'),
  check('preview')
    .isBoolean()
    .withMessage('Please indicate if the image is a preview'),
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.userId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const newImage = await Image.create({ url, preview, spotId: id });

  res.status(200).json({ id: newImage.id, url: newImage.url, preview: newImage.preview });
}));




// router.post('/:id/images', requireAuth, async (req, res) => {
//   // Check if the user is logged in
//   if (!req.user) {
//     return res.status(401).json({
//       message: 'Authentication required'
//     });
//   }

//   try {
//     const spotId = req.params.id;
//     const userId = req.user.id;
//     const { url, preview } = req.body;

//     // Retrieve the spot with the provided ID
//     const spot = await Spot.findByPk(spotId);

//     // If the spot doesn't exist, return an error
//     if (!spot) {
//       return res.status(404).json({
//         message: 'Spot couldn\'t be found',
//       });
//     }

//     // If the spot's owner isn't the current user, return an error
//     if (spot.ownerId !== userId) {
//       return res.status(403).json({
//         message: 'Unauthorized',
//       });
//     }

//     // Create the new Image
//     const image = await Image.create({
//       url,
//       preview,
//       indexId: spotId,
//       indexType: 'Spot',
//     });

//     // Respond with the newly created image
//     return res.status(200).json({
//       id: image.id,
//       url: image.url,
//       preview: image.preview,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Internal server error'
//     });
//   }
// });


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
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
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





// router.get('/', async (req, res, next) => {
//   try {
//     // Retrieve all spots from the database
//     const spots = await Spot.findAll({
//       attributes: [
//         'id',
//         'ownerId',
//         'address',
//         'city',
//         'state',
//         'country',
//         'lat',
//         'lng',
//         'name',
//         'description',
//         'price',
//         'createdAt',
//         'updatedAt',
//       ],
//     });

//     // Prepare the response data
//     const spotData = await Promise.all(spots.map(async (spot) => {
//       const previewImage = await Image.findOne({
//         where: {
//           indexType: 'Spot',
//           indexId: spot.id,
//           previewImage: true,
//         },
//       });

//       return {
//         id: spot.id,
//         ownerId: spot.ownerId,
//         address: spot.address,
//         city: spot.city,
//         state: spot.state,
//         country: spot.country,
//         lat: spot.lat,
//         lng: spot.lng,
//         name: spot.name,
//         description: spot.description,
//         price: spot.price,
//         createdAt: spot.createdAt,
//         updatedAt: spot.updatedAt,
//         previewImage: previewImage ? previewImage.url : null,
//       };
//     }));

//     // Send the successful response with the spot data
//     return res.json({ Spots: spotData });
//   } catch (error) {
//     // Handle any errors that occur during the request
//     return next(error);
//   }
// });







// GET /spots - Return spots filtered by query parameters
// router.get('/', async (req, res) => {
//   const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

//   // Validate query parameters
//   const errors = {};

//   // Validate page
//   if (page < 1 || page > 10) {
//     errors.page = 'Page must be between 1 and 10';
//   }

//   // Validate size
//   if (size < 1 || size > 20) {
//     errors.size = 'Size must be between 1 and 20';
//   }

//   // Validate latitude and longitude
//   if (minLat && isNaN(minLat)) {
//     errors.minLat = 'Minimum latitude is invalid';
//   }
//   if (maxLat && isNaN(maxLat)) {
//     errors.maxLat = 'Maximum latitude is invalid';
//   }
//   if (minLng && isNaN(minLng)) {
//     errors.minLng = 'Minimum longitude is invalid';
//   }
//   if (maxLng && isNaN(maxLng)) {
//     errors.maxLng = 'Maximum longitude is invalid';
//   }

//   // Validate price
//   if (minPrice && isNaN(minPrice)) {
//     errors.minPrice = 'Minimum price is invalid';
//   }
//   if (maxPrice && isNaN(maxPrice)) {
//     errors.maxPrice = 'Maximum price is invalid';
//   }

//   // If there are validation errors, return a 400 Bad Request response
//   if (Object.keys(errors).length > 0) {
//     return res.status(400).json({
//       message: 'Bad Request',
//       errors: errors
//     });
//   }

//   try {
//     // Set up filter object based on query parameters
//     const filter = {};

//     if (minLat && maxLat) {
//       filter.lat = {
//         [Op.between]: [minLat, maxLat]
//       };
//     }

//     if (minLng && maxLng) {
//       filter.lng = {
//         [Op.between]: [minLng, maxLng]
//       };
//     }

//     if (minPrice && maxPrice) {
//       filter.price = {
//         [Op.between]: [minPrice, maxPrice]
//       };
//     }

//     // Fetch spots based on the filter
//     const spots = await Spot.findAll({
//       where: filter,
//       offset: (page - 1) * size,
//       limit: size
//     });

//     // Prepare the response data
//     const responseData = {
//       Spots: spots,
//       page: parseInt(page, 10),
//       size: parseInt(size, 10)
//     };

//     // Send the successful response with the spots data
//     return res.status(200).json(responseData);
//   } catch (error) {
//     // Handle any errors that occur during the request
//     console.error(error);
//     return res.status(500).json({
//       message: 'Internal server error'
//     });
//   }
// });



module.exports = router;

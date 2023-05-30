const express = require('express');
const { Op} = require('sequelize');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { Spot, Review, sequelize, Image, User, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const models = require('../../db/models'); 

// new school

router.get('/', async (req, res, next) => {
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query
  const where = {}
  const errors = {}
  if (size){
    if(!isNaN(size) && size > 0 && size < 21){size = +size}
    else if(size > 20){size = 20}
    else if (size < 1){
      errors.size="Size must be greater than or equal to 1"
    } else {size = 20}
  } else {size = 20}

if(page){
  if(!isNaN(page) && page <= 11 && page > 1){page =+ page}
  else if (page > 10 ){page = 10}
  else if (page < 1){errors.message = "Page must be greater than or equal to 1"}
  else {page = 1 }
} else {page = 1 }

const offset = size * (page -1)
if(minLat && !isNan(minLat)) {
  if(minLat <-90 || minLat > 90){
    errors.minLat = "Minimum latitude is invalid"
  } else {where.lat = {[Op.gte]:+minLat}}
}

if (minPrice && !isNaN(minPrice)) {
if (minPrice < 0){
  errors.minPrice = "Minimum price must be greater than or equal to 0"
} else {where.price = {[Op.gte]: +minPrice}}
}


if (maxPrice && !isNaN(maxPrice)) {
  if (maxPrice < 0){
    errors.maxPrice = "Maximum price must be greater than or equal to 0"
  } else {where.price = {[Op.lte]: +maxPrice}}
  }
  if(maxLat && !isNaN(maxLat)) {
    if(maxLat <-90 || maxLat > 90){
      errors.maxLat = "Maximum latitude is invalid";
    } else {
      if (!where.lat) where.lat = {};
      where.lat[Op.lte] = +maxLat;
    }
  }
  
  if(minLng && !isNaN(minLng)) {
    if(minLng <-180 || minLng > 180){
      errors.minLng = "Minimum longitude is invalid";
    } else {
      where.lng = {[Op.gte]: +minLng};
    }
  }
  
  if(maxLng && !isNaN(maxLng)) {
    if(maxLng <-180 || maxLng > 180){
      errors.maxLng = "Maximum longitude is invalid";
    } else {
      if (!where.lng) where.lng = {};
      where.lng[Op.lte] = +maxLng;
    }
  }
  
  if (Object.keys(errors).length !== 0){
    err = new Error ()
    err.status = 400
    err.message = "Bad Request"
    err.errors = errors
    return next (err)
  }

const spots = await Spot.findAll({
  limit:size,
  offset:offset,
  where
})


let resultsSpot = []
for (let spot of spots){
  spot = spot.toJSON()
  if(spot){
    let starsum = await Review.sum('stars', {where:{spotId:spot.id}})
    let {count} = await Review.findAndCountAll({where:{spotId:spot.id}, attributes:['stars']})
    spot.avgRating = starsum/count // math is hard

   const image = await Image.findOne({
    where:{indexId:spot.id, previewImage: true},
    attributes:["url"],
    raw:true
   });
   if(image){spot.previewImage = image.url;}else  {spot.previewImage=null}
   resultsSpot.push(spot)
  }
}
return res.json({"Spots":resultsSpot, page, size})

})



// // legacy frankestein mosnter of the two comented out routes smushed together, had a problem with query paramaters not working irght 
// router.get('/', async (req, res, next) => {
//   try {
//     const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

//     // Validate query parameters
//     const errors = {};

//     // Validate page
//     if (page < 1 || page > 10) {
//       errors.page = 'Page must be between 1 and 10';
//     }

//     // Validate size
//     if (size < 1 || size > 20) {
//       errors.size = 'Size must be between 1 and 20';
//     }

//     // Validate latitude and longitude
//     if (minLat && isNaN(minLat)) {
//       errors.minLat = 'Minimum latitude is invalid';
//     }
//     if (maxLat && isNaN(maxLat)) {
//       errors.maxLat = 'Maximum latitude is invalid';
//     }
//     if (minLng && isNaN(minLng)) {
//       errors.minLng = 'Minimum longitude is invalid';
//     }
//     if (maxLng && isNaN(maxLng)) {
//       errors.maxLng = 'Maximum longitude is invalid';
//     }

//     // Validate price
//     if (minPrice && isNaN(minPrice)) {
//       errors.minPrice = 'Minimum price is invalid';
//     }
//     if (maxPrice && isNaN(maxPrice)) {
//       errors.maxPrice = 'Maximum price is invalid';
//     }

//     // If there are validation errors, return a 400 Bad Request response
//     if (Object.keys(errors).length > 0) {
//       return res.status(400).json({
//         message: 'Bad Request',
//         errors: errors
//       });
//     }

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

//       // Load the reviews for this spot
//       const reviews = await spot.getReviews();
      
//       // Calculate the average rating
//       let avgRating = 0;
//       if (reviews.length > 0) {
//         const totalStars = reviews.reduce((total, review) => total + review.stars, 0);
//         avgRating = totalStars / reviews.length;
//       }

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
//         avgRating: parseFloat(avgRating || 0), // Default to 0 if avgRating is null
//       };
//     }));

//     // Send the successful response with the spot data
//     return res.status(200).json({
//       Spots: spotData,
//       page: parseInt(page, 10),
//       size: parseInt(size, 10),
//     });
//   } catch (error) {
//     // Handle any errors that occur during the request
//     console.error(error);
//     return res.status(500).json({
//       message: 'Internal server error'
//     });
//   }
// });

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
      where: { spotId }, raw:true
  });

  for (let review of reviews) {
      review.User = await User.findOne({where:{ id: review.userId},attributes:{exclude:['username']}});
      review.ReviewImages = await Image.findAll({ where: { indexId: review.id },attributes:['id','url'] });
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
  let errors = {};

  if (!review || typeof review !== 'string' || review.length === 0) {
    errors.review = 'Review text is required';
  }
  
  if (!stars || typeof stars !== 'number' || stars < 1 || stars > 5) {
    errors.stars = 'Stars must be an integer from 1 to 5';
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Bad Request', errors: errors });
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


// GET /spots/:id - Get Spot Details by ID
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
      },
      attributes: { exclude: ['username'] } // Exclude username
    });

    const images = await models.Image.findAll({
      where: {
        indexId: spot.id,
        indexType: 'Spot'
      },
      attributes: ['id', 'url', 'previewImage'] // Only include id, url, previewImage
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
      attributes:{exclude:['previewImage']}
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
       attributes:{exclude:['previewImage']}
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
], handleValidationErrors, async (req, res) => {
  const { id } = req.params;
  const { url, preview } = req.body;
console.log(preview, 'this is the first log of the preview')
  const spot = await Spot.findByPk(id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const newImage = await Image.create({ url, previewImage: preview, indexId: id, indexType: 'Spot' });


  // If the image is a preview image, update the Spot's previewImage field
  if (preview) {
    try {
        console.log(`Updating spot ${spot.id} preview image with url: ${url}`);
        await spot.update({ previewImage: url });
        console.log(`Updated spot preview image: ${spot.previewImage}`);
    } catch (error) {
        console.error('Error updating spot preview image:', error);
        return res.status(500).json({ message: "Error updating Spot's preview image" });
    }
}



return res.status(200).json({ id: newImage.id, url: newImage.url, preview: newImage.previewImage });

});




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
//     const { url, preview, type } = req.body;  // Include type here

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
//       previewImage: preview,  // Here, use previewImage, as per  model
//       type,  // Include type here
//       indexId: spotId,
//       indexType: 'Spot',
//     });

//     // Respond with the newly created image
//     return res.status(200).json({
//       id: image.id,
//       url: image.url,
//       type: image.type,  // Include type here
//       preview: image.previewImage,  // Here, use previewImage, as per  model
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'This is no longer a generic error: Internal server error'
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
  let { startDate, endDate } = req.body;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Check if start and end dates are valid
  if (isNaN(startDate) || isNaN(endDate)) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "Invalid start date",
        endDate: "Invalid end date",
      },
    });
  }

  // Fetch the spot
  const spot = await Spot.findByPk(spotId);

  // Check if spot exists
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Check if current user is the owner of the spot
  if (spot.ownerId === req.user.id) {
    return res.status(403).json({
      message: "You can't book your own spot",
    });
  }

  // Check if endDate is on or before startDate
  if (endDate <= startDate) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }

  // Find bookings that overlap with the new start and end dates
  const overlappingBookings = await Booking.findAll({
    where: {
      spotId: spotId,
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate: { [Op.between]: [startDate, endDate] } },
        {
          startDate: { [Op.lte]: startDate },
          endDate: { [Op.gte]: endDate },
        },
      ],
    },
  });

  // If there are overlapping bookings, return an error
  if (overlappingBookings.length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  // Create the new booking
  const newBooking = await Booking.create({
    spotId: spotId,
    userId: req.user.id,
    startDate: startDate,
    endDate: endDate,
  });

  // Send the successful response with the new booking data
  return res.status(200).json(newBooking);
});




//legacy 
// router.post('/:spotid/bookings', requireAuth, async (req, res) => {
//   const spotId = parseInt(req.params.spotid, 10);
//   const { startDate, endDate } = req.body;

//   // Fetch the spot
//   const spot = await Spot.findByPk(spotId);

//   // Check if spot exists
//   if (!spot) {
//       return res.status(404).json({
//           message: "Spot couldn't be found"
//       });
//   }

//   // Check if current user is the owner of the spot
//   if (spot.ownerId === req.user.id) {
//       return res.status(403).json({
//           message: "You can't book your own spot"
//       });
//   }

//   // Check if endDate is on or before startDate
//   if (new Date(endDate) <= new Date(startDate)) {
//       return res.status(400).json({
//           message: "Bad Request",
//           errors: {
//               endDate: "endDate cannot be on or before startDate"
//           },
//       });
//   }

//   // Find bookings that overlap with the new start and end dates
//   const overlappingBookings = await Booking.findAll({
//       where: {
//           spotId: spotId,
//           [Op.or]: [
//               { startDate: { [Op.between]: [startDate, endDate] } },
//               { endDate: { [Op.between]: [startDate, endDate] } }
//           ]
//       }
//   });

//   // If there are overlapping bookings, return an error
//   if (overlappingBookings.length > 0) {
//       return res.status(403).json({
//           message: "Sorry, this spot is already booked for the specified dates",
//           errors: {
//               startDate: "Start date conflicts with an existing booking",
//               endDate: "End date conflicts with an existing booking"
//           },
//       });
//   }

//   // Create the new booking
//   const newBooking = await Booking.create({
//       spotId: spotId,
//       userId: req.user.id,
//       startDate: startDate,
//       endDate: endDate
//   });

//   // Send the successful response with the new booking data
//   return res.status(200).json(newBooking);
// });




module.exports = router;

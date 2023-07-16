const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, Booking , Image} = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

// new validateSignup
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')  // Add this
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')  // Add this
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  handleValidationErrors
];
// new sign in 
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    // Check if a user with the same email or username already exists
    const userExists = await User.findOne({ where: {  username  } });
    const emailExists = await User.findOne({ where: {  email  } });
   if(userExists || emailExists){
    errors = {}
    const err = new Error()
    err.status = 500;
    err.message = "User already exists"
    if(emailExists){
      errors.email = "User with that email already exists"
    }
   if(userExists){
    errors.username = "User with that username already exists"
   }
   err.errors = errors
   return next(err)

   }
   
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, firstName, lastName, hashedPassword });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);














// const validateSignup = [
//   check('email')
//     .exists({ checkFalsy: true })
//     .isEmail()
//     .withMessage('Invalid email'),
//   check('username')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage('Please provide a username with at least 4 characters.'),
//   check('username')
//     .not()
//     .isEmail()
//     .withMessage('Username cannot be an email.'),
//   check('password')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 6 })
//     .withMessage('Password must be 6 characters or more.'),
//   handleValidationErrors
// ];






// old school method (just in case, I'm a code hoarder remember? )
// router.post(
//   '/',
//   validateSignup,
//   async (req, res) => {
//     // Extract the required user information from the request body
//     const { email, password, username, firstName, lastName } = req.body;

//     // Hash the password using bcrypt
//     const hashedPassword = bcrypt.hashSync(password);

//     // Create a new user in the database with the provided information
//     const user = await User.create({ email, username, firstName, lastName, hashedPassword });

//     // Create a safeUser object with the user's information to be sent in the response
//     const safeUser = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//       firstName: user.firstName, // Include firstName attribute
//       lastName: user.lastName, // Include lastName attribute
//     };

//     // Set the authentication token cookie in the response
//     await setTokenCookie(res, safeUser);

//     // Return the safeUser object in the response JSON
//     return res.json({
//       user: safeUser
//     });
//   }
// );

// Get Current User
router.get('/', requireAuth, async (req, res) => {
  try {
    const { id, email, username, firstName, lastName } = req.user;

    const currentUser = await User.findByPk(id, {
      attributes: ['id', 'email', 'username', 'firstName', 'lastName']
    });

    if (currentUser) {
      const safeUser = {
        id: currentUser.id,
        email: currentUser.email,
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName
      };

      return res.status(200).json({
        user: safeUser
      });
    } else {
      return res.status(404).json({
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});


// GET /user/reviews - Get all reviews of the current user
router.get('/reviews', requireAuth, async (req, res, next) => {
  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  try {
    // Find all reviews from the current user
    const userReviews = await Review.findAll({
      where: {
        userId: req.user.id
      }
    });

    // Prepare the response data
    const reviewData = await Promise.all(userReviews.map(async (review) => {
      // Load the User and Spot for this review
      const user = await User.findOne({ where: { id: review.userId },attributes:{exclude:['username']}});
      const spot = await Spot.findOne({ where: { id: review.spotId },attributes:{exclude:['description','createdAt','updatedAt']}});

      // Load the review images for this review
      const reviewImages = await Image.findAll({
        where: {
          indexId: review.id,
          indexType: 'Review'
        }, attributes:['id','url']
      });

      return {
        ...review.get({ plain: true }), // Convert Sequelize instance to plain object
        User: user.get({ plain: true }), // Convert Sequelize instance to plain object
        Spot: spot.get({ plain: true }), // Convert Sequelize instance to plain object
        ReviewImages: reviewImages.map(image => image.get({ plain: true })) // Convert Sequelize instances to plain objects
      };
    }));

    // Send the successful response with the review data
    return res.status(200).json({ Reviews: reviewData });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Get all Spots owned by the Current User // redid it  
router.get('/spots', requireAuth, async (req, res) => {
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
        'previewImage' // Add 'previewImage' to the attributes
      ]
    });

    // Check if any spots were found
    if (spots.length === 0) {
      return res.status(200).json({
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
      const image = await Image.findOne({
        where:{indexId:spot.id, previewImage: true},
        attributes:["url"],
        raw:true
       });
       if(image){spot.previewImage = image.url;}else  {spot.previewImage=null}
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
        previewImage: spot.previewImage, // Directly use the 'previewImage' attribute
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


// GET /user/bookings - Get all bookings of the current user
router.get('/bookings', requireAuth, async (req, res) => {
  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  try {
    // Find all bookings from the current user
    const userBookings = await Booking.findAll({
      where: {
        userId: req.user.id
      }
    });

    // Prepare the response data
    const bookingData = await Promise.all(userBookings.map(async (booking) => {
      // Load the Spot for this booking
      const spot = await Spot.findOne({ 
        where: { id: booking.spotId },
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'], // Only fetch these attributes
      });

      return {
        ...booking.get({ plain: true }), // Convert Sequelize instance to plain object
        Spot: spot.get({ plain: true }) // Convert Sequelize instance to plain object
      };
    }));

    // Send the successful response with the booking data
    return res.status(200).json({ Bookings: bookingData });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});


module.exports = router;

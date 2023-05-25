const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Review, Spot, Image } = require('../../db/models'); 
const router = express.Router();

// GET /user/reviews - Get all reviews of the current user
router.get('/user/reviews', requireAuth, async (req, res, next) => {
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
        const user = await User.findOne({ where: { id: review.userId }});
        const spot = await Spot.findOne({ where: { id: review.spotId }});
  
        // Load the review images for this review
        const reviewImages = await Image.findAll({
          where: {
            indexId: review.id,
            indexType: 'Review'
          }
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
  
// GET all reviews by a spot's ID
router.get('/spots/:id/reviews', requireAuth(async (req, res, next) => {
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
}));


// POST /spots/:id/reviews - Create a new review for a spot specified by id
router.post('/spots/:id/reviews', requireAuth, async (req, res, next) => {
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


// Add an Image to a Review based on the Review's id
router.post('/reviews/:reviewId/images', requireAuth, async (req, res, next) => {
    // Extract the reviewId from the request parameters and convert it to a number
    const reviewId = parseInt(req.params.reviewId, 10);

    // Extract the image URL from the request body
    const { url } = req.body;

    // Check if the user is authenticated
    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    try {
        // Check if the review exists and belongs to the current user
        const review = await Review.findOne({
            where: {
                id: reviewId,
                userId: req.user.id
            }
        });

        // If the review doesn't exist, return a 404 error
        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        // Check if the review already has the maximum number of images (10)
        const existingImagesCount = await Image.count({
            where: {
                indexId: reviewId,
                indexType: 'Review'
            }
        });

        if (existingImagesCount >= 10) {
            return res.status(403).json({
                message: 'Maximum number of images for this resource was reached'
            });
        }

        // Create a new image with the provided URL and associate it with the review
        const newImage = await Image.create({
            url,
            indexId: reviewId,
            indexType: 'Review'
        });

        // Return the new image data
        return res.status(201).json(newImage.get({ plain: true }));
    } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

// DELETE /reviews/:id - Delete an existing review
router.delete('/reviews/:id', requireAuth, async (req, res, next) => {
    // Extract the review's ID from the URL parameters
    const reviewId = parseInt(req.params.id, 10);

    // If the user is not authenticated, return an error
    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    try {
        // Try to find the review with the given ID that also belongs to the authenticated user
        const review = await Review.findOne({
            where: {
                id: reviewId,
                userId: req.user.id
            }
        });

        // If no such review could be found, return a 404 error
        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        // Delete the review from the database
        await Review.destroy({
            where: {
                id: reviewId
            }
        });

        // If the deletion was successful, return a success message
        return res.status(200).json({
            message: 'Successfully deleted'
        });
    } catch (error) {
        // If an error occurred while trying to delete the review, log the error and return a 500 Internal Server Error response
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});




module.exports = router;
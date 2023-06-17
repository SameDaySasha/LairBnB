const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Review, Spot, Image } = require('../../db/models'); 
const router = express.Router();



// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
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
            }
        });

        // If the review doesn't exist, return a 404 error
        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        // Check if the review already has the maximum number of images (10)
        const existingImagesCount = await Image.findAndCountAll({
            where: {
                indexId: reviewId,
                indexType: 'Review'
            }
        });
const {count} = existingImagesCount
        if (count >= 9) {
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

// Edit a Review based on the Review's id

router.put('/:id', requireAuth, async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
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
    const reviewToBeUpdated = await Review.findById(req.params.id);
    if (!reviewToBeUpdated) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }
    
    // Update the review and return the new review data
    const updatedReview = await reviewToBeUpdated.update({
      review,
      stars
    }, { returning: true });
    
    return res.status(200).json(updatedReview);
  });
  

// DELETE /reviews/:id - Delete an existing review
router.delete('/:id', requireAuth, async (req, res, next) => {
    // Extract the review's ID from the URL parameters
    const reviewId = parseInt(req.params.id, 10);

    // If the user is not authenticated, return an error
    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    try {
        // Try to find the review with the given ID
        const review = await Review.findOne({
            where: {
                id: reviewId,
            }
        });

        // If no such review could be found, return a 404 error
        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        // Check if the authenticated user is the owner of the review
        if (req.user.id !== review.userId) {
            return res.status(403).json({
                message: 'Review must belong to the current user'
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

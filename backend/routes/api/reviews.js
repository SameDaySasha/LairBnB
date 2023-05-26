const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Review, Spot, Image } = require('../../db/models'); 
const router = express.Router();



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

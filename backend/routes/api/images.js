const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot, Image } = require('../../db/models');
const router = express.Router();

// DELETE /images/:imageId - Delete an existing image for a Spot
router.delete('/:imageId', requireAuth, async (req, res) => {
  const imageId = parseInt(req.params.imageId, 10);

  try {
    // Find the image to be deleted
    const image = await Image.findByPk(imageId);

    // Check if the image exists
    if (!image) {
      return res.status(404).json({
        message: "Spot Image couldn't be found"
      });
    }

    // Fetch the corresponding spot
    const spot = await Spot.findByPk(image.spotId);

    // Check if the spot exists and belongs to the current user
    if (!spot || spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "You don't have permission to delete this Spot Image"
      });
    }

    // Delete the image
    await image.destroy();

    // Send the successful response
    return res.status(200).json({
      message: "Successfully deleted"
    });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});


// DELETE /images/:imageId - Delete an existing image for a Review
router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = parseInt(req.params.imageId, 10);
  
    try {
      // Find the image to be deleted
      const image = await Image.findByPk(imageId);
  
      // Check if the image exists
      if (!image) {
        return res.status(404).json({
          message: "Review Image couldn't be found"
        });
      }
  
      // Fetch the corresponding review
      const review = await Review.findByPk(image.reviewId);
  
      // Check if the review exists and belongs to the current user
      if (!review || review.userId !== req.user.id) {
        return res.status(403).json({
          message: "You don't have permission to delete this Review Image"
        });
      }
  
      // Delete the image
      await image.destroy();
  
      // Send the successful response
      return res.status(200).json({
        message: "Successfully deleted"
      });
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  });
  


module.exports = router;

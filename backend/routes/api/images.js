const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot, Image, Review } = require('../../db/models');
const router = express.Router();


// DELETE /images/:imageId - Delete an existing image for a Spot or Review
router.delete('/:imageId', requireAuth, async (req, res) => {
  const imageId = parseInt(req.params.imageId, 10);

  try {
    // Find the image to be deleted
    const image = await Image.findByPk(imageId);

    // Check if the image exists
    if (!image) {
      return res.status(404).json({
        message: "Image couldn't be found"
      });
    }

    // Fetch the corresponding spot or review based on the image's indexType
    let parent;
    if (image.indexType === 'Spot') {
      parent = await Spot.findByPk(image.indexId);
      if (!parent || parent.userId !== req.user.id) {
        return res.status(403).json({
          message: "You don't have permission to delete this Spot Image"
        });
      }
    } else if (image.indexType === 'Review') {
      parent = await Review.findByPk(image.indexId);
      if (!parent || parent.userId !== req.user.id) {
        return res.status(403).json({
          message: "You don't have permission to delete this Review Image"
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid indexType"
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











// I'm apprehensive to delete anything and therefore am a code hoarder 
// DELETE /images/:imageId - Delete an existing image for a Spot
// router.delete('/:imageId', requireAuth, async (req, res) => {
//   const imageId = parseInt(req.params.imageId);

//   try {
//     // Find the image to be deleted
//     const image = await Image.findByPk(imageId);

//     // Check if the image exists
//     if (!image) {
//       return res.status(404).json({
//         message: "Review Image couldn't be found"
//       });
//     }
// if (image.userid !== req.user.id) {
//   throw new Error('Review must belong to the current user')
// }

    

//     // Delete the image
//     await image.destroy();

//     // Send the successful response
//     return res.status(200).json({
//       message: "Successfully deleted"
//     });
//   } catch (error) {
//     // Handle any errors that occur during the request
//     console.error(error);
//     return res.status(500).json({
//       message: 'Internal server error'
//     });
//   }
// });


// // DELETE /images/:imageId - Delete an existing image for a Review
// router.delete('/:imageId', requireAuth, async (req, res) => {
//     const imageId = parseInt(req.params.imageId, 10);
  
//     try {
//       // Find the image to be deleted
//       const image = await Image.findByPk(imageId);
  
//       // Check if the image exists
//       if (!image) {
//         return res.status(404).json({
//           message: "Review Image couldn't be found"
//         });
//       }
  
//       // Fetch the corresponding review
//       const review = await Review.findByPk(image.reviewId);
  
//       // Check if the review exists and belongs to the current user
//       if (!review || review.userId !== req.user.id) {
//         return res.status(403).json({
//           message: "You don't have permission to delete this Review Image"
//         });
//       }
  
//       // Delete the image
//       await image.destroy();
  
//       // Send the successful response
//       return res.status(200).json({
//         message: "Successfully deleted"
//       });
//     } catch (error) {
//       // Handle any errors that occur during the request
//       console.error(error);
//       return res.status(500).json({
//         message: 'Internal server error'
//       });
//     }
//   });
  


module.exports = router;

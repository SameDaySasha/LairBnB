const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spotRoutes'); 
const reviewsRouter = require('./reviews.js'); 
const { restoreUser } = require("../../utils/auth.js");
const bookingsRouter = require('./bookings.js'); 
const imagesRouter = require('./images.js'); 

// Connect restoreUser middleware to the API router
// If the current user session is valid, set req.user to the user in the database
// If the current user session is not valid, set req.user to null
router.use(restoreUser);


router.use('/bookings', bookingsRouter);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter); 
router.use('/reviews', reviewsRouter); // Mount the reviews router
router.use('/images', imagesRouter); // Mount the images router
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// Error-handling middleware
router.use((err, req, res, next) => {
  // Set the status code of the response
  res.status(err.status || 500);

  // Send the error message as JSON
  res.json({
    message: err.message || 'Internal server error',
    errors: err.errors || null,
  });
});


module.exports = router;

const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spotRoutes'); // Add this line to import the spots router
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If the current user session is valid, set req.user to the user in the database
// If the current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/user', usersRouter);
router.use('/spots', spotsRouter); // Mount the spots router

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;

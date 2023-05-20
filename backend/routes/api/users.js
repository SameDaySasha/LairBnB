const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    // Extract the required user information from the request body
    const { email, password, username, firstName, lastName } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = bcrypt.hashSync(password);

    // Create a new user in the database with the provided information
    const user = await User.create({ email, username, firstName, lastName, hashedPassword });

    // Create a safeUser object with the user's information to be sent in the response
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName, // Include firstName attribute
      lastName: user.lastName, // Include lastName attribute
    };

    // Set the authentication token cookie in the response
    await setTokenCookie(res, safeUser);

    // Return the safeUser object in the response JSON
    return res.json({
      user: safeUser
    });
  }
);

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

module.exports = router;

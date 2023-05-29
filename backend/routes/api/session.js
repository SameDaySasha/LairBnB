const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
// router.post(
//   '/',
//   validateLogin,
//   handleValidationErrors,
//   async (req, res, next) => {
//     const { credential, password } = req.body;

//     const user = await User.unscoped().findOne({
//       where: {
//         [Op.or]: {
//           username: credential,
//           email: credential
//         }
//       }
//     });

//     if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
//       const err = new Error('Login failed');
//       err.status = 401;
//       err.title = 'Login failed';
//       err.errors = { credential: 'The provided credentials were invalid.' };
//       return next(err);
//     }

//     const safeUser = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//       firstName: user.firstName, // Include firstName attribute
//       lastName: user.lastName, // Include lastName attribute
//     };

//     await setTokenCookie(res, safeUser);

//     return res.json({
//       user: safeUser
//     });
//   }
// );


// legacy code, use as backup if my current thing doesn't work 
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName, // Include firstName attribute
      lastName: user.lastName, // Include lastName attribute
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

// // Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName, // Include firstName attribute
        lastName: user.lastName, // Include lastName attribute
      };
      return res.json({
        user: safeUser
      });
    } else {
      return res.json({ user: null });
    }
  }
);

module.exports = router;

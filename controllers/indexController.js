const pool = require('../database/pool')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

const validationRules = [
  body('firstName').trim().escape().isLength({ min: 1, max: 50 }).withMessage('First name must be at least 1 character long and at most 50 characters long'),
  body('lastName').trim().escape().isLength({ min: 1, max: 50 }).withMessage('Last name must be at least 1 character long and at most 50 characters long'),
  body('username').trim().escape().isLength({ min: 1, max: 50 }).withMessage('Username must be at least 1 character long and at most 50 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  // Custom validation to check if passwords match
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true
  }),
]

const getHomepage = (req, res) => {
  res.render('index', {
    title: 'Home',
    content: 'pages/homepage',
  })
}

const getSignup = (req, res) => {
  res.render('index', {
    title: 'Sign Up',
    content: 'pages/signup',
    formData: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  })
}

const postSignup = [
  validationRules,
  async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      for (const error of errors.array()) {
        if (error.path === 'firstName') {
          req.body.firstName = ''
        } else if (error.path === 'lastName') {
          req.body.lastName = ''
        } else if (error.path === 'username') {
          req.body.username = ''
        } else if (error.path === 'password') {
          req.body.password = ''
          req.body.confirmPassword = ''
        } else if (error.path === 'confirmPassword') {
          req.body.confirmPassword = ''
        }
      }

      return res.status(400).render('index', {
        title: 'Sign Up',
        content: 'pages/signup',
        errors: errors.array(),
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          confirmPassword: req.body.confirmPassword,
          password: req.body.password,
        },
      })
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      await pool.query('insert into users (first_name, last_name, username, password) values ($1, $2, $3, $4)', [req.body.firstName, req.body.lastName, req.body.username, hashedPassword])
      res.redirect('/membership')
    } catch (error) {
      console.error(error)
      next(error)
    }
  },
]

const getMembership = (req, res) => {
  res.render('index', {
    title: 'Membership',
    content: 'pages/membership',
  })
}

const postMembership = async (req, res, next) => {
  const passcode = req.body.passcode

  if (passcode !== 'asd') {
    return res.status(403).render('index', {
      title: 'Membership',
      content: 'pages/membership',
      errors: [{ msg: 'Invalid passcode' }],
    })
  }

  try {
    await pool.query('UPDATE users SET membership_status = true WHERE username = $1', [req.session.username])
    res.redirect('/')
  } catch (error) {
    console.error(error)
    return next(error)
  }
}

module.exports = {
  getHomepage,
  getSignup,
  postSignup,
  getMembership,
  postMembership,
}

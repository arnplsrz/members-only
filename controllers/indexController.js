const pool = require('../database/pool')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

const validationRules = [
  body('firstName').trim().escape().isLength({ min: 1, max: 50 }).withMessage('First name must be at least 1 character long and at most 50 characters long'),
  body('lastName').trim().escape().isLength({ min: 1, max: 50 }).withMessage('Last name must be at least 1 character long and at most 50 characters long'),
  body('username').trim().escape().isLength({ min: 1, max: 50 }).withMessage('Username must be at least 1 character long and at most 50 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
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
  })
}

const postSignup = [
  validationRules,
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render('index', {
        title: 'Sign Up',
        content: 'pages/signup',
        errors: errors.array(),
      })
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      await pool.query('insert into users (first_name, last_name, username, password) values ($1, $2, $3, $4)', [req.body.firstName, req.body.lastName, req.body.username, hashedPassword])
      res.redirect('/')
    } catch (error) {
      console.error(error)
      next(error)
    }
  },
]

module.exports = {
  getHomepage,
  getSignup,
  postSignup,
}

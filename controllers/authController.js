const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const pool = require('../database/pool')
const queries = require('../database/queries')

const validationRules = [
  body('firstName').trim().escape().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 chars'),
  body('lastName').trim().escape().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 chars'),
  body('username').trim().escape().isLength({ min: 1, max: 50 }).withMessage('Username must be 1-50 chars'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true
  }),
]

const getSignup = async (req, res) => {
  if (req.user) {
    const { posts } = await queries.getPosts()
    res.render('index', {
      title: 'Home',
      content: 'pages/homepage',
      posts: posts,
      user: req.user,
      error: 'Already logged in',
    })
  } else {
    res.render('index', {
      title: 'Sign Up',
      content: 'pages/signup',
      user: req.user,
      formData: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
    })
  }
}

const postSignup = [
  validationRules,
  async (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors)

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
      res.redirect('/')
    } catch (error) {
      console.error(error)
      next(error)
    }
  },
]

const getSignin = async (req, res) => {
  if (req.user) {
    const { posts } = await queries.getPosts()
    res.render('index', {
      title: 'Home',
      content: 'pages/homepage',
      posts: posts,
      user: req.user,
      error: 'Already logged in',
    })
  } else {
    res.render('index', {
      title: 'Sign In',
      content: 'pages/signin',
      user: req.user,
      formData: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
    })
  }
}

const postSignin = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err)
      return next(err)
    }
    if (!user) {
      return res.status(401).render('index', {
        title: 'Sign In',
        content: 'pages/signin',
        errors: [{ msg: info.message }],
        formData: {
          username: req.body.username,
          password: '',
        },
      })
    }

    req.logIn(user, err => {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.redirect('/')
    })
  })(req, res, next)
}

const getLogout = (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err)
      return next(err)
    }
    res.redirect('/')
  })
}

module.exports = {
  getSignup,
  postSignup,
  getSignin,
  postSignin,
  getLogout,
}

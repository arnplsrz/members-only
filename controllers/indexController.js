const bcrypt = require('bcryptjs')
const passport = require('passport')
const { body, validationResult } = require('express-validator')
const pool = require('../database/pool')

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

async function getPosts() {
  try {
    const result = await pool.query(`
      SELECT 
        posts.id AS post_id,
        posts.title,
        posts.content,
        posts.timestamp,
        users.id AS user_id,
        users.first_name,
        users.last_name,
        users.username,
        users.is_admin
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.timestamp DESC
    `)

    const posts = result.rows.map(row => ({
      id: row.post_id,
      title: row.title,
      content: row.content,
      timestamp: row.timestamp,
      user: {
        id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        username: row.username,
        is_admin: row.is_admin,
      },
    }))

    return { posts }
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

const getHomepage = async (req, res) => {
  const { posts } = await getPosts()
  res.render('index', {
    title: 'Home',
    content: 'pages/homepage',
    posts: posts,
    user: req.user,
  })
}

const postDeleteMessage = async (req, res, next) => {
  const postId = req.params.id

  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [postId])
    res.redirect('/')
  } catch (error) {
    console.error(error)
    next(error)
  }
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
      res.redirect('/')
    } catch (error) {
      console.error(error)
      next(error)
    }
  },
]

const getSignin = (req, res) => {
  res.render('index', {
    title: 'Sign In',
    content: 'pages/signin',
    formData: {
      username: '',
      password: '',
    },
  })
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
          password: req.body.password,
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

const getMembership = (req, res) => {
  if (!req.user) {
    return res.status(403).render('index', {
      title: 'Sign in',
      content: 'pages/signin',
      formData: {
        username: '',
        password: '',
      },
      errors: [{ msg: 'You must be signed in to access that page' }],
    })
  }

  res.render('index', {
    title: 'Membership',
    content: 'pages/membership',
    user: req.user,
  })
}

const postMembership = async (req, res, next) => {
  const passcode = req.body.passcode

  if (passcode === process.env.MEMBERSHIP_PASSCODE) {
    try {
      await pool.query('UPDATE users SET membership_status = true WHERE username = $1', [req.user.username])
      res.redirect('/')
    } catch (error) {
      console.error(error)
      return next(error)
    }
  }

  if (passcode === process.env.ADMIN_PASSCODE) {
    try {
      await pool.query('UPDATE users SET is_admin = true WHERE username = $1', [req.user.username])
      res.redirect('/')
    } catch (error) {
      console.error(error)
      return next(error)
    }
  }
}

module.exports = {
  getHomepage,
  postDeleteMessage,
  getSignup,
  postSignup,
  getSignin,
  postSignin,
  getMembership,
  postMembership,
}

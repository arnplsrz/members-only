const path = require('node:path')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const pool = require('./database/pool')
const indexRoute = require('./routes/indexRoute')

require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)

app.use(express.static('public'))
app.use(express.json())
app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }))
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRoute)

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username])
      const user = rows[0]

      if (!user) {
        return done(null, false, { message: 'Incorrect username' })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return done(null, false, { message: 'Incorrect password' })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    const user = rows[0]

    done(null, user)
  } catch (err) {
    done(err)
  }
})

app.listen(process.env.PORT)

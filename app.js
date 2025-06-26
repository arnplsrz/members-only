const path = require('node:path')
const { Pool } = require('pg')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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

app.listen(process.env.PORT)

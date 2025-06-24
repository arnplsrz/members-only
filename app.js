const express = require('express')
const indexRoute = require('./routes/indexRoute')

require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', indexRoute)

app.listen(process.env.PORT)

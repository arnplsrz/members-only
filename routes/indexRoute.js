const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController')

router.get('/', indexController.getHomepage)

router.get('/sign-up', indexController.getSignup)
router.post('/sign-up', indexController.postSignup)

module.exports = router

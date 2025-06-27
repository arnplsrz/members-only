const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController')

router.get('/', indexController.getHomepage)

router.get('/sign-up', indexController.getSignup)
router.post('/sign-up', indexController.postSignup)

router.get('/sign-in', indexController.getSignin)
router.post('/sign-in', indexController.postSignin)

router.get('/membership', indexController.getMembership)
router.post('/membership', indexController.postMembership)

module.exports = router

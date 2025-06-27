const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController')
const messageController = require('../controllers/messageController')
const membershipController = require('../controllers/membershipController')
const authController = require('../controllers/authController')

router.get('/', indexController.getHomepage)

router.get('/new-message', messageController.getNewMessage)
router.post('/new-message', messageController.postNewMessage)
router.post('/posts/:id/delete', messageController.postDeleteMessage)

router.get('/membership', membershipController.getMembership)
router.post('/membership', membershipController.postMembership)

router.get('/sign-up', authController.getSignup)
router.post('/sign-up', authController.postSignup)
router.get('/sign-in', authController.getSignin)
router.post('/sign-in', authController.postSignin)
router.get('/log-out', authController.getLogout)

module.exports = router

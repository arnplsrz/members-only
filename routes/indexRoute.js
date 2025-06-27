const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController')
const messageController = require('../controllers/messageController')

router.get('/', indexController.getHomepage)

router.post('/posts/:id/delete', indexController.postDeleteMessage)

router.get('/sign-up', indexController.getSignup)
router.post('/sign-up', indexController.postSignup)

router.get('/sign-in', indexController.getSignin)
router.post('/sign-in', indexController.postSignin)

router.get('/membership', indexController.getMembership)
router.post('/membership', indexController.postMembership)

router.get('/new-message', messageController.getNewMessage)
router.post('/new-message', messageController.postNewMessage)

module.exports = router

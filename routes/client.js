const express = require('express')
const router = express.Router()
const clientSiteController = require('../controllers/client/siteController')
const clientDashController = require('../controllers/client/dashboardController')
const clientAuthController = require('../controllers/client/authController') 
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', clientSiteController.getIndex)
router.get('/dashboard',clientDashController.getIndex)
router.get('/login', clientAuthController.getIndex)

module.exports = router
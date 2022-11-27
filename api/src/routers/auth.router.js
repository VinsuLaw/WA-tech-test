const {Router} = require('express')
const authController = require('../controllers/auth.controller')

const router = Router()

router.post('/regin', authController.regin)
router.post('/login', authController.login)

module.exports = router
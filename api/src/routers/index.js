const {Router} = require('express')
const authRouter = require('./auth.router.js')
const taskRouter = require('./task.router.js')

const router = Router()

router.use('/auth', authRouter)
router.use('/task', taskRouter)

module.exports = router
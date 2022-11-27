const {Router} = require('express')
const taskController = require('../controllers/task.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

router.post('/create', authMiddleware, taskController.create)
router.get('/get', authMiddleware, taskController.get)
router.post('/update', authMiddleware, taskController.update)
router.delete('/delete', authMiddleware, taskController.delete)

module.exports = router
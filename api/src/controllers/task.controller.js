const { default: ApiError } = require("../exceptions/api.error");
const ApiResponse = require("../responses/api.response");
const { getOne } = require("../services/task.service");
const taskService = require("../services/task.service");

class TaskController {
    async create(req, res, next) {
        try {
            const uid = req.headers.authorization
            const userData = await taskService.create(req.body, req.files, uid)
            return res.json(userData)
        } catch (e) {
            return next(e)
        }
    }

    async get(req, res, next) {
        try {
            const {id} = req.query
            const uid = req.headers.authorization
            let userData
            
            if (id) {
                userData = await taskService.getOne(id, uid)
            } else {
                userData = await taskService.get(uid)
            }

            return res.json(userData)
        } catch (e) {
            return next(e)
        }
    }

    async update(req, res, next) {
        try {
            let { id, field, value, deleted_file, action } = req.body
            const uid = req.headers.authorization

            if (field === 'completed') {
                if (value === 'true') {
                    value = true
                } else {
                    value = false
                }
            } 

            const userData = await taskService.update(uid, id, field, value, deleted_file, action, req.files)

            return res.json(userData)
        } catch (e) {
            console.log(e);
            return next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.query
            const uid = req.headers.authorization

            const userData = await taskService.delete(uid, id)

            return res.json(userData)
        } catch (e) {
            return next(e)
        }
    }
}

module.exports = new TaskController()
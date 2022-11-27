const { default: ApiError } = require("../exceptions/api.error")
const authService = require("../services/auth.service")

class AuthController {
    async regin(req, res, next) {
        try {
            const { uid } = req.body

            if (!uid) {
                return next(ApiError.BadRequest("You has no uid"))
            }

            const userData = await authService.regin(uid)

            return res.json(userData)
        } catch (e) {
            return next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { uid } = req.body

            if (!uid) {
                return next(ApiError.BadRequest("You has no uid"))
            }

            const userData = await authService.login(uid)

            return res.json(userData)
        } catch (e) {
            return next(e)
        }
    }
}

module.exports = new AuthController()
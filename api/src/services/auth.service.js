const ApiError = require('../exceptions/api.error.js')
const userModel = require('../models/user.model.js')
const ApiResponse = require('../responses/api.response.js')

class AuthService {
    async regin(uid) {
        try {
            await userModel.create({ uid })
            return ApiResponse.Created()
        } catch (e) {
            throw e
        }
    }

    async login(uid) {
        try {
            const candidate = await userModel.findOne({uid})

            if (!candidate) {
                throw ApiError.BadRequest("Such user doesn't exist")
            }

            return ApiResponse.Success()
        } catch (e) {
            throw e
        }
    }
}

module.exports = new AuthService()
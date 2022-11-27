const ApiError = require("../exceptions/api.error")

module.exports = async function (req, res, next) {
    if (!req.headers.authorization) {
        return next(ApiError.UnauthorizedError())
    }

    next()
}
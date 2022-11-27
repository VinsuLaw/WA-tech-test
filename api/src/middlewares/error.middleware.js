const ApiError = require('../exceptions/api.error.js')

module.exports = function (err, _, res, _) {
    if (err instanceof ApiError) {
        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors })
    }

    return res.status(500).json({ message: 'Undefined error has been occured' })
}
module.exports = class ApiResponse {
    static Created(message = 'Created', body = []) {
        return {status: 201, message, body}
    }

    static Success(message = 'Success', body = []) {
        return {status: 200, message, body}
    }
}
const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
    uid: String
})

module.exports = model('User', userSchema)
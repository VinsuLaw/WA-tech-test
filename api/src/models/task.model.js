const mongoose = require('mongoose')
const { Schema, model } = mongoose

const taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    tasks: [Object],
})

module.exports = model('Task', taskSchema)
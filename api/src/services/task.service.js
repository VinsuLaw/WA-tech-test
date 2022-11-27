const ApiError = require("../exceptions/api.error")
const taskModel = require("../models/task.model")
const userModel = require("../models/user.model")
const ApiResponse = require("../responses/api.response")
const path = require('path')
const fs = require('fs')

class TaskService {
    async create(data, files, uid) {
        try {
            const candidate = await userModel.findOne({uid})
            if (!candidate) {
                throw ApiError.UnauthorizedError()
            }

            let files_paths = []
            let files_arr = []

            if (files) {
                files_arr = Array.from(files.file)
            }
      
            if (files_arr.length > 0) {
                files_arr.forEach((file) => {
                    file.mv(path.resolve(__dirname, '..', '..', 'static', file.name))
                    files_paths.push(file.name)
                })
            } else if (files_arr.length === 0 && files) {
                files.file.mv(path.resolve(__dirname, '..', '..', 'static', files.file.name))
                files_paths.push(files.file.name)
            }

            const userTasks = await taskModel.findOne({user: candidate._id})

            let deadline = data.deadline
            const id = new Date().getTime() / 1000

            if (!userTasks) {
                await taskModel.create({user: candidate._id, tasks: {
                    id,
                    title: data.title,
                    description: data.description,
                    deadline,
                    attachments: files_paths,
                    completed: false
                }}) 
            } else {
                await taskModel.findOneAndUpdate({user: candidate._id}, {
                    $push: {
                        tasks: {
                            id,
                            title: data.title,
                            description: data.description,
                            deadline,
                            attachments: files_paths,
                            completed: false
                        }
                    }
                })
            }

            return ApiResponse.Created()
        } catch (e) {
            console.log(e);
            throw e
        }
    }

    async get(uid) {
        try {
            const candidate = await userModel.findOne({uid})
            if (!candidate) {
                throw ApiError.UnauthorizedError()
            }

            const userTasks = await taskModel.findOne({user: candidate._id})
            if (!userTasks) {
                return ApiResponse.Success('Success')
            }
        
            return ApiResponse.Success('Success', userTasks.tasks)
        } catch (e) {
            console.log(e);
            throw e
        }
    } 

    async getOne(id, uid) {

    }

    static nop() {}

    async update(uid, idO, field, value, deleted_file, action, files) {
        try {
            const candidate = await userModel.findOne({uid})
            if (!candidate) {
                throw ApiError.UnauthorizedError()
            }

            const id = Number(idO)

            if (field === 'attachments' && action === 'delete') {
                let value_arr = []
        
                fs.rm(path.resolve(__dirname, '..', '..', 'static', deleted_file), (err) => {
                    if (err) {
                        return ApiError.BadRequest('Rm file error')
                    }
                })

                if (value.length > 0) {
                    value_arr = value.split(',')
                }

                await taskModel.updateOne({ user: candidate._id, 'tasks.id': id },
                    { $set: { [`tasks.$.${field}`]: value_arr } }
                )

                return ApiResponse.Success()
            } else if (field === 'attachments' && action === 'upload') {
                let files_paths = []
                let files_arr = []

                if (files) {
                    files_arr = Array.from(files.file)
                }
        
                if (files_arr.length > 0) {
                    files_arr.forEach((file) => {
                        file.mv(path.resolve(__dirname, '..', '..', 'static', file.name))
                        files_paths.push(file.name)
                    })
                } else if (files_arr.length === 0 && files) {
                    files.file.mv(path.resolve(__dirname, '..', '..', 'static', files.file.name))
                    files_paths.push(files.file.name)
                }

                let foundTask = (await taskModel.findOne({'tasks.id': id})).tasks
                foundTask = foundTask.filter((task) => {
                    if (task.id === id) {
                        return task
                    }
                })

                let taskAttachments = foundTask[0].attachments
                taskAttachments = taskAttachments.concat(files_paths)
                
                await taskModel.updateOne({user: candidate._id, 'tasks.id': id},
                    {$set: { [`tasks.$.${field}`]: taskAttachments }}
                ) 

                return ApiResponse.Success()
            } 

            console.log(field, value);

            await taskModel.updateOne({ user: candidate._id, 'tasks.id': id },
                { $set: { [`tasks.$.${field}`]: value } }
            )

            return ApiResponse.Success()
        } catch (e) {
            console.log(e);
            throw e
        }
    }

    async delete(uid, id) {
        try {
            const uid_n = Number(id)
            const candidate = await userModel.findOne({uid})
            if (!candidate) {
                throw ApiError.UnauthorizedError()
            }

            await taskModel.findOneAndUpdate({ user: candidate._id },
                {
                    $pull: {
                        tasks: { id: uid_n },
                    },
                }
            )

            return ApiResponse.Success()
        } catch (e) {
            throw e
        }
    }
}

module.exports = new TaskService()
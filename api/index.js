require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./src/routers/index.js')
const errorMiddleware = require('./src/middlewares/error.middleware.js')
const fileUpload = require('express-fileupload')
const path = require('path')

const app = express()
const PORT = 3090

app.use(express.json())
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
)
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload())
app.use('/api', router)
app.use(errorMiddleware)

async function startApp() {
    try {
        console.log(process.env.DB_URL);

        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        app.listen(PORT, () =>
            console.log(`Server is running on ${PORT} port...`)
        )
    } catch (e) {
        console.log(e.message)
    }
}

startApp()
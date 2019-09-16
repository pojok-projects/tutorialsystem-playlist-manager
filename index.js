const express = require('express')
const app = express()

// use body parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// load .env data
const dotenv = require('dotenv')
dotenv.config()

// cors
const cors = require('cors')
app.use(cors())

// call router in folder routes
const router = require('./routes')
router(app)

// jalankan nodejs di port sesuai ENV
app.listen(process.env.PORT, () => {
    console.log('server running at port', process.env.PORT)
})
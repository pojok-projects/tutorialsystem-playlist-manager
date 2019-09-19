const express = require('express')
const app = express()

// call router in folder routes
const mainRouter = require('./routes')
app.use('/', mainRouter)

// jalankan nodejs di port sesuai ENV
app.listen(process.env.PORT, () => {
    console.log('server running at port', process.env.PORT)
})
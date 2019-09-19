const express = require('express')
const pmRouter = require('./pm')

const mainRouter = express()

// use body parser
const bodyParser = require('body-parser')
mainRouter.use(bodyParser.json())

// load .env data
const dotenv = require('dotenv')
dotenv.config()

// cors
const cors = require('cors')
mainRouter.use(cors())

// pm router
mainRouter.use('/pm', pmRouter)

// default error unknown route fallback
mainRouter.all('/*',(req, res) => {
    res.status(422).send({
        code: 422,
        path: req.originalUrl,
        method: req.method,
        message: "Invalid Request"
    }) 
})

// Default Error Fallback
mainRouter.use(( error , req, res, next) => {
	return res.status(422).send({ status: {
        code: 422,
        message: error.message,
        succeeded: false
    }});
});

module.exports = mainRouter
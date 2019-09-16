const { Playlists } = require('../controller')

const router = (app) => {
    app.get('/playlists/:userid', Playlists.index)
    app.post('/playlists/:userid/create', Playlists.create)

    // default error return
    app.all('/*',(req, res) => {
        res.status(422).send({
            code: 422,
            path: req.originalUrl,
            method: req.method,
            message: "Invalid Request"
        }) 
    })
}

module.exports = router
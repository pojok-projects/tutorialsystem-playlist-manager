const { PlaylistsController } = require('../controller')

const router = (app) => {
    app.get('/playlists/:userid', PlaylistsController.index)
    app.post('/playlists/:userid/create', PlaylistsController.create)

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
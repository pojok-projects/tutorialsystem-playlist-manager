const playlists = require('express').Router()

const { PlaylistsController } = require('../../../controller')

playlists.get('/:userid', PlaylistsController.index)
playlists.post('/:userid/create', PlaylistsController.create)

module.exports = playlists
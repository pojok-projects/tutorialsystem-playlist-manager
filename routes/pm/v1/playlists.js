const playlists = require('express').Router()

const { PlaylistsController } = require('../../../controller')

playlists.get('/', PlaylistsController.index)
playlists.get('/:userid', PlaylistsController.show)
playlists.post('/:userid/create', PlaylistsController.create)
playlists.post('/:userid/update/:playlistsid', PlaylistsController.update)
playlists.post('/:userid/delete/:playlistsid', PlaylistsController.delete)

module.exports = playlists
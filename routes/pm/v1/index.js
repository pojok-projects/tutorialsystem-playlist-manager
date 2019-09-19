const v1 = require('express').Router()
const playlists = require('./playlists')
const playlistscategory = require('./playlistscategory')

v1.use('/playlists', playlists)
v1.use('/category', playlistscategory)

module.exports = v1;
const playlistscategory = require('express').Router()

const { PlaylistCategoryController } = require('../../../controller')

playlistscategory.get('/', PlaylistCategoryController.index)
playlistscategory.post('/create', PlaylistCategoryController.create)
playlistscategory.get('/:id', PlaylistCategoryController.show)
playlistscategory.post('/search', PlaylistCategoryController.search)
playlistscategory.post('/update/:id', PlaylistCategoryController.update)
playlistscategory.post('/delete/:id', PlaylistCategoryController.delete)

module.exports = playlistscategory
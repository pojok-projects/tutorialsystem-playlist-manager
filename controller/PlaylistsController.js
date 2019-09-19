const axios = require('axios')
const uuid = require('uuid/v4')
const dotenv = require('dotenv')
dotenv.config()

const apidbil = process.env.ENDPOINTAPI_DBIL
const { groupData } = require('./HelpersController')

module.exports = {
    index: async(req, res, next) => {
        try {
            const axiosReq = await axios.get(apidbil + '/user/' + req.params.userid)

            if(axiosReq.status === 200) {
                const groupByPCID = groupData('playlistcategory_id')
                res.send({
                    status : {
                        code: 200,
                        message: 'success'
                    },
                    data: groupByPCID(axiosReq.data.playlists)
                })
            } else {
                throw new Error(axiosReq)
            }
        } catch (err) {
            next(err)
        }
    },
    create: async(req, res, next) => {
        try {
            // get all playlists data
            const axiosReq = await axios.get(apidbil + '/user/' + req.params.userid)
            const allplaylist = axiosReq.data.playlists

            // get form input
            const { categoryid, metadataid, orderlist, lastwatch } = req.body

            // get date now
            const now = new Date().toISOString()

            // set new data to object
            const newplaylist = {
                id: uuid(),
                playlistcategory_id: categoryid,
                metadata_id: metadataid,
                order_list: orderlist ? orderlist : null,
                last_watch: lastwatch ? lastwatch : null,
                created_at: now,
                updated_at: now
            }

            // check if duplicate data in playlists
            // find metadata_id and playlistcategory_id
            const findplaylists = allplaylist.filter((items) => {
                return (items.metadata_id === metadataid && items.playlistcategory_id === categoryid)
            })

            if(findplaylists.length > 0) {
                throw new Error('Skip, Duplicated Data')
            }

            // check if allplaylists is null or not
            // if not null, then merged array allplaylists
            // with object from newplaylists
            // then in data post, check again for post first time or not
            if(allplaylist !== null) {
                allplaylist.push(newplaylist)
            }

            // update playlists
            const PostData = await axios({
                method: 'POST',
                url: apidbil + '/user/update/' + req.params.userid,
                headers: {
                    accept: "application/json"
                },
                data: {
                    playlists: allplaylist ? allplaylist : [newplaylist]
                }
            })

            res.json(PostData.data)
        } catch (err) {
            next(err)
        }
    },
    update: async(req, res,next) => {
        try {
            // get all playlists data
            const axiosReq = await axios.get(apidbil + '/user/' + req.params.userid)
            const allplaylist = axiosReq.data.playlists

            // Get id
            const playlistsid = req.params.playlistsid

            // get form input
            const { categoryid, metadataid, orderlist, lastwatch } = req.body

            // get date now
            const now = new Date().toISOString()

            // find playlists index key
            let findplaylists = allplaylist.findIndex(items => items.id === playlistsid)

            // update based key
            // update playlistcategory_id if not null
            if(categoryid !== null) {
                allplaylist[findplaylists].playlistcategory_id = categoryid
            }

            // update metadata_id if not null
            if(metadataid !== null) {
                allplaylist[findplaylists].metadata_id = metadataid
            }

            // update order_list if not null
            if(orderlist !== null) {
                allplaylist[findplaylists].order_list = orderlist
            }

            // update last_watch if not null
            if(lastwatch !== null) {
                allplaylist[findplaylists].last_watch = lastwatch
            }

            // update updated_at time now
            allplaylist[findplaylists].updated_at = now

            // update playlists
            const PostData = await axios({
                method: 'POST',
                url: apidbil + '/user/update/' + req.params.userid,
                headers: {
                    accept: "application/json"
                },
                data: {
                    playlists: allplaylist
                }
            })

            res.json(PostData.data)
        } catch (err) {
            next(err)
        }
    },
    delete: async(req, res, next) => {
        try {
            // get all playlists data
            const axiosReq = await axios.get(apidbil + '/user/' + req.params.userid)
            const allplaylist = axiosReq.data.playlists

            // Get id
            const playlistsid = req.params.playlistsid
            
            // find playlists id
            const findplaylists = allplaylist.filter((items) => {
                return items.id !== playlistsid
            })

            // update playlists
            const PostData = await axios({
                method: 'POST',
                url: apidbil + '/user/update/' + req.params.userid,
                headers: {
                    accept: "application/json"
                },
                data: {
                    playlists: findplaylists
                }
            })

            res.json(PostData.data)
        } catch (err) {
            next(err)
        }
    }
}
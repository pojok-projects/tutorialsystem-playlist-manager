const axios = require('axios')
const uuid = require('uuid/v4')
const _ = require('underscore')
const dotenv = require('dotenv')
dotenv.config()

const apidbil = process.env.ENDPOINTAPI_DBIL

module.exports = {
    index: async(req, res, next) => {
        try {
            const axiosReq = await axios.get(apidbil + 'user/' + req.params.userid)

                if(axiosReq.status === 200) {
                    const allplaylist = axiosReq.data.playlists

                    if(allplaylist !== null) {
                        const grsoData =  _.groupBy(_.sortBy(axiosReq.data.playlists, 'order_list'), 'playlistcategory_id');

                        res.send({
                            status : {
                                code: 200,
                                message: 'success'
                            },
                            data: grsoData
                        })
                    } else {
                        throw new Error('Playlists Not Found..!!')
                    }
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
            const axiosReq = await axios.get(apidbil + 'user/' + req.params.userid)
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

            if(allplaylist !== null) {

                // check if duplicate data in playlists
                // find metadata_id and playlistcategory_id
                const findplaylists = _.filter(allplaylist, (items) => {
                    return (items.metadata_id === metadataid && items.playlistcategory_id === categoryid)
                })

                if(findplaylists.length > 0) {
                    throw new Error('Skip, Duplicated Data')
                }

                // check if allplaylists is null or not
                // if not null, then merged array allplaylists
                // with object from newplaylists
                // then in data post, check again for post first time or not
                allplaylist.push(newplaylist)
            }

            // update playlists
            const PostData = await axios({
                method: 'POST',
                url: apidbil + 'user/update/' + req.params.userid,
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
            const axiosReq = await axios.get(apidbil + 'user/' + req.params.userid)
            const allplaylist = axiosReq.data.playlists

            if(allplaylist == null) {
                throw new Error('Unable update data, data not found..!!')
            }

            // Get id
            const playlistsid = req.params.playlistsid

            // get form input
            const { categoryid, metadataid, orderlist, lastwatch } = req.body

            // get date now
            const now = new Date().toISOString()

            // find playlists index key
            let findplaylists = allplaylist.findIndex(items => items.id == playlistsid)

            // update based key
            // update playlistcategory_id if not null
            allplaylist[findplaylists].playlistcategory_id = categoryid ? categoryid : allplaylist[findplaylists].playlistcategory_id

            // update metadata_id if not null
            allplaylist[findplaylists].metadata_id = metadataid ? metadataid : allplaylist[findplaylists].metadata_id

            // update order_list if not null
            allplaylist[findplaylists].order_list = orderlist ? orderlist : allplaylist[findplaylists].order_list

            // update last_watch if not null
            allplaylist[findplaylists].last_watch = lastwatch ? lastwatch : allplaylist[findplaylists].last_watch

            // update updated_at time now
            allplaylist[findplaylists].updated_at = now

            // update playlists
            const PostData = await axios({
                method: 'POST',
                url: apidbil + 'user/update/' + req.params.userid,
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
            const axiosReq = await axios.get(apidbil + 'user/' + req.params.userid)
            const allplaylist = axiosReq.data.playlists

            // Get id
            const playlistsid = req.params.playlistsid
            
            if(allplaylist == null) {
                throw new Error('Unable delete data, data not found..!!')
            }

            // find playlists id
            const findplaylists = allplaylist.filter((items) => {
                return items.id !== playlistsid
            })

            // update playlists
            const PostData = await axios({
                method: 'POST',
                url: apidbil + 'user/update/' + req.params.userid,
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
const axios = require('axios')
const uuid = require('uuid/v4')
const _ = require('underscore')
const dotenv = require('dotenv')
dotenv.config()

const apidbil = process.env.ENDPOINTAPI_DBIL

const getCategory = async (idcategory) => {
    const axiosReq = await axios.get(apidbil + 'content/playlists/category/' + idcategory)

    if (axiosReq.status == 200) {
        return axiosReq.data
    } else {
        throw new Error('axiosReq')
    }
}

const getPlaylists = async (userid, categoryid) => {
    const axiosReq = await axios.get(apidbil + 'user/' + userid)

    if (axiosReq.status === 200) {
        const allplaylist = axiosReq.data.playlists

        if (allplaylist !== null) {
            const orderData = _.sortBy(axiosReq.data.playlists, 'order_list')

            let grsoData = null
            if (categoryid) {
                grsoData = _.filter(orderData, (items) => {
                    if (items.playlistcategory_id == categoryid) {
                        return items
                    }
                });
            } else {
                grsoData = _.groupBy(orderData, 'playlistcategory_id');
            }

            return grsoData
        } else {
            throw new Error('Playlists Not Found..!!')
        }
    } else {
        throw new Error(axiosReq)
    }
}

module.exports = {
    index: async (req, res, next) => {
        try {
            const axiosReq = await axios.get(apidbil + 'user')

            // filter for playlists not empty
            const playlists = _.filter(axiosReq.data.result, (items) => {
                if (items.playlists != null) {
                    return items
                }
            })

            // get userid
            const userid = _.shuffle(_.pluck(playlists, 'id'))

            // default limit value
            let limitList = 12

            // if limit in body has been set, then return based limit on body
            const {
                limit
            } = req.query
            if (limit) {
                limitList = limit
            }

            // limit output
            const maxuser = _.sample(userid, limitList)

            // variable for save all playlists
            let dataPlaylists = []

            // loop user to get playlists
            for (let i = 0; i < maxuser.length; i++) {
                // get playlists grouped by playlists category
                const newPlay = await getPlaylists(maxuser[i], null)

                // get key group playlists category
                const playkey = _.keys(newPlay)

                // get value group playlists category
                const playval = _.values(newPlay)

                // make variable for index playlists
                let newIndexPlay = null

                // loop playlists category
                for (let n = 0; n < playkey.length; n++) {
                    if (playkey[n] !== 'null') {
                        // get playlists category data based id
                        const newCate = await getCategory(playkey[n])

                        // make new object for category and the list
                        newIndexPlay = {
                            category: newCate,
                            lists: playval[n] // only show playlists with same key
                        }

                        // push array
                        dataPlaylists.push(newIndexPlay)
                    }
                }
            }

            res.send({
                status: {
                    code: 200,
                    success: true
                },
                data: dataPlaylists
            })
        } catch (err) {
            next(err)
        }
    },
    show: async (req, res, next) => {
        try {
            let dataPlaylists = null

            // check category has been set
            const {
                category
            } = req.query
            if (category) {
                dataPlaylists = await getPlaylists(req.params.userid, category)
            } else {
                dataPlaylists = await getPlaylists(req.params.userid)
            }

            res.send({
                status: {
                    code: 200,
                    success: true
                },
                data: dataPlaylists
            })
        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            // get all playlists data
            const axiosReq = await axios.get(apidbil + 'user/' + req.params.userid)
            const allplaylist = axiosReq.data.playlists

            // get form input
            const {
                categoryid,
                metadataid,
                orderlist,
                lastwatch
            } = req.body

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

            if (allplaylist !== null) {

                // check if duplicate data in playlists
                // find metadata_id and playlistcategory_id
                const findplaylists = _.filter(allplaylist, (items) => {
                    return (items.metadata_id === metadataid && items.playlistcategory_id === categoryid)
                })

                if (findplaylists.length > 0) {
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
    update: async (req, res, next) => {
        try {
            // get all playlists data
            const axiosReq = await axios.get(apidbil + 'user/' + req.params.userid)
            const allplaylist = axiosReq.data.playlists

            if (allplaylist == null) {
                throw new Error('Unable update data, data not found..!!')
            }

            // Get id
            const playlistsid = req.params.playlistsid

            // get form input
            const {
                categoryid,
                metadataid,
                orderlist,
                lastwatch
            } = req.body

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
    delete: async (req, res, next) => {
        try {
            // get all playlists data
            const axiosReq = await axios.get(apidbil + 'user/' + req.params.userid)
            const allplaylist = axiosReq.data.playlists

            // Get id
            const playlistsid = req.params.playlistsid

            if (allplaylist == null) {
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
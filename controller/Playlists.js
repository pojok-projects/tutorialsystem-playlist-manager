const axios = require('axios')
const uuid = require('uuid/v4')
const dotenv = require('dotenv')
dotenv.config()

const apidbil = process.env.ENDPOINTAPI_DBIL
const { groupData, pushData } = require('./Helpers')

module.exports = {
    index: async(req, res, next) => {
        try {
            const axiosReq = await axios.get(apidbil + '/user/' + req.params.userid)

            if(axiosReq.status === 200) {
                const groupByPCID = groupData('playlistcategory_id')
                res.send(groupByPCID(axiosReq.data.playlists))
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
            const { categoryid, metadataid, orderlist } = req.body

            // get date now
            const now = new Date()

            // set new data to object
            const newplaylist = {
                id: uuid(),
                playlistcategory_id: categoryid,
                metadata_id: metadataid,
                order_list: orderlist,
                created_at: now.toISOString(),
                updated_at: now.toISOString()
            }

            // check if old data is null or not
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
    }
}
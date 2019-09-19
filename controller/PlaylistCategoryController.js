const axios = require('axios')
const uuid = require('uuid/v4')
const dotenv = require('dotenv')
dotenv.config()

const apidbil = process.env.ENDPOINTAPI_DBIL

module.exports = {
    index: async(req, res, next) => {
        try {
            const axiosReq = await axios.get(apidbil + '/content/playlists/category')

            if(axiosReq.status === 200) {
                res.send(axiosReq.data)
            } else {
                throw new Error(axiosReq)
            }
        } catch (err) {
            next(err)
        }
    },
    create: async(req, res, next) => {
        try {
            // get form input
            const { userid, title, description, status } = req.body

            const newData = {
                user_id: userid,
                title: title,
                description: description,
                status: status
            }

            // send post
            const PostData = await axios({
                method: 'POST',
                url: apidbil + 'content/playlists/category/store',
                headers: {
                    accept: "application/json"
                },
                data: newData
            })

            res.json(PostData.data)
        } catch (err) {
            next(err)
        }
    },
    show: async(req, res, next) => {
        try {
            const axiosReq = await axios.get(apidbil + '/content/playlists/category/' + req.params.id)

            if(axiosReq.status === 200) {
                res.send(axiosReq.data)
            } else {
                throw new Error(axiosReq)
            }
        } catch (err) {
            next(err)
        }
    },
    search: async(req, res, next) => {
        try {
            // get form input
            const { title } = req.body

            // send post
            const PostData = await axios({
                method: 'POST',
                url: apidbil + '/content/playlists/category/search',
                headers: {
                    accept: "application/json"
                },
                data: {
                    title: title
                }
            })

            res.json(PostData.data)
        } catch (err) {
            next(err)
        }
    },
    update: async(req, res, next) => {
        try {
            // get form input
            const { userid, title, description, status } = req.body

            // send post
            const PostData = await axios({
                method: 'POST',
                url: apidbil + '/content/playlists/category/update' + req.params.id,
                headers: {
                    accept: "application/json"
                },
                data: {
                    userid: userid ? userid : null,
                    title: title ? title : null,
                    description: description ? description : null,
                    status: status ? status : null
                }
            })

            res.json(PostData.data)
        } catch (err) {
            next(err)
        }
    },
    delete: async(req, res, next) => {
        try {
            // send post
            const PostData = await axios({
                method: 'POST',
                url: apidbil + '/content/playlists/category/delete' + req.params.id,
                headers: {
                    accept: "application/json"
                }
            })

            res.json(PostData.data)
        } catch (err) {
            next(err)
        }
    }
}
const { types } = require('./types/types.js')

const ingest = async (req, res) => {
    console.log(req.user.uid)
    try {
        const { type } = req.body
        console.log(type)
        await types[type].handle(req, res)

    } catch (error) {
        console.error(error)
        res.sendStatus(403)
    }
    // res.json({
    //     data: 'test'
    // })
}
const create = async (req, res) => {
    console.log(req.user.uid)
    try {
        const { type } = req.body
        console.log(type)
        await types[type].create(req, res)

    } catch (error) {
        console.error(error)
        res.sendStatus(403)
    }
    // res.json({
    //     data: 'test'
    // })
}

module.exports = { create, ingest }
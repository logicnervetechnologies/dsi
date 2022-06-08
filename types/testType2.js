const { v4 : uuidv4 } = require('uuid')
const { dsiCol } = require("../resources.js")

const TYPE = 'testType2'

const handle = (req, res) => {
    // console.log(req.user)
    // console.log(req.body)
    const {dsid, data} = req.body
    if (typeof data === 'number') {
        dsiCol.updateOne(
            {dsid, type: TYPE},
            {$push: {array: data}}
            )
        res.sendStatus(200) 
    }
    if (Array.isArray(data)) {
        console.log('array')
        dsiCol.updateOne(
            {dsid},
            {$push:{array:{$each: data}}}
            )
        res.sendStatus(200) 
    }
}

const create = async (req, res) => {
    const ndsid = uuidv4()
    console.log("creating new ingest")
    newEntry = {
        dsid: ndsid,
        type: TYPE,
        uid: req.user.uid,
        array: []
    }
    console.log(newEntry)
    await dsiCol.insertOne(newEntry)
    res.json({
        dsid: ndsid
    })
}

module.exports = { create, handle }
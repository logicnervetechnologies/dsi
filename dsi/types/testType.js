const { dsiCol } = require("../resources.js")
const { createDoc } = require('./create.js')
const TYPE = 'testType'


console.log("create doc type")
console.log(typeof(createDoc))
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
    console.log("creating new ingest")
    newEntry = {
        type: TYPE,
        array: []
    }
    console.log(typeof(createDoc))
    const ndsid = await createDoc(req.user.uid, TYPE, newEntry)
    res.json({
        dsid: ndsid
    })
}

module.exports = { create, handle }
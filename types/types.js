const testType = require('./testType.js')
const testType2 = require('./testType2.js')
const { dsiCol } = require("../resources.js")
const bson = require('bson')

const types = {
    testType:{
        create: testType.create,
        handle: testType.handle
    },
    testType2:{
        create: testType2.create,
        handle: testType2.handle
    }
}


const read = async (req, res) => {
    // If user is dsid user, then return object, else check to ensure
    // user fetching data is authorized viewer of uid on dsi document
    const { dsid, type } = req.body
    const { uid } = req.user
    const dsiDoc = await dsiCol.findOne({dsid, type})
    const size = bson.calculateObjectSize(dsiDoc)
    console.log('docsize: ' + size)
    // TODO: check if response doc is valid
    if (dsiDoc.uid === uid) {
        res.json(dsiDoc)
    } else {
        res.sendStatus(401)
    }
}

module.exports = { types, read }
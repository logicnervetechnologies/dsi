const { dsiCol, userCol} = require("../resources.js")
const { v4 : uuidv4 } = require('uuid')

const createDoc = async (uid, type, dataEntry, manInput=false) => {
    const ndsid = uuidv4()
    console.log("creating new ingest")
    newEntry = {
        dsid: ndsid,
        uid,
        type,
        manInput,
        ...dataEntry
    }
    console.log(newEntry)
    await dsiCol.insertOne(newEntry)
    await userCol.updateOne({uid}, {$push: {dsids: {
        dsid: ndsid,
        type
    }}})
    return ndsid

}

module.exports = { createDoc }
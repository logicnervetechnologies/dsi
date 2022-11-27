const { hdataCol} = require("../resources.js")
const { log } = require('../log.js')

// insert singular entry to dsid
const insertEntry = async (uid, dataEntry, dsid) => {
    if (typeof(dataEntry) != 'object') {
        log('not obj data entry')
        return null
    }
    const hEntry = await getHEntry(uid, dsid)
    if (hEntry == null) return null

    const ndata = validateParams(hEntry.params, dataEntry)
    if (ndata == null) return null

    hdataCol.updateOne({dsid}, {$push:{data: t}})
    return 1
}


// insert multiple entries to dsid
const insertMultipleEntries = async (uid, dataEntry, dsid) => {
    if (typeof(dataEntry) != 'array') {
        log('not array of entries')
        return null
    }
    
    const hEntry = await getHEntry(uid, dsid)
    if (hEntry == null) return null
    allvalid = true
    narr = []
    i = 0
    dataEntry.forEach(entry => {
        x = validateParams(hEntry.params, entry)
        if (x == null) {
            log(`entry: ${i} invalid`)
            allvalid = false
        }
        narr.push(x)
        i+=1
    })
    if (!allvalid) return null
    hdataCol.updateOne({dsid}, {$push:{data:{$each: narr}}})
    return 1
}



// retreive dsid
const getHEntry = async (uid, dsid) => {
    const hEntry = await hdataCol.findOne({dsid})
    if (hEntry == null) {
        log("hEntry doesn't exist")
        return null
    }
    if (hEntry.uid != uid) {
        log("UNAUTHORIZED REQUEST HENTRY")
        return null
    }
    return hEntry
}


// validate the parameters for a single data entry
const validateParams = (params, dataEntry) => {
    t = {
        time: Date.now()
    }
    if ('time' in dataEntry) t.time = dataEntry.time
    validDataType = true
    Object.keys(params).forEach( param => {
        if (dataEntry[param] == null) validDataType = false
        if (params[param] != typeof(dataEntry[param])) validDataType = false
        t[param] = dataEntry[param]
    })
    if (!validDataType) {
        log("invalid datatype")
        return null
    }
    return t

}
module.exports = { insertEntry, insertMultipleEntries, getHEntry}
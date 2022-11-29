const { types } = require('./types/types.js')
const { createSchema, createDsiEntry, getSchemas} = require('./schema/schema.js')
const { insertEntry, insertMultipleEntries, getHEntry } = require('./hdata/hdata.js')
const { log } = require('./log.js')
const ingest = async (req, res) => {
    const uid = req.user.uid
    log(`${uid} attempting to push data`)
    try {
        const { hdata, dsid } = req.body
        log(`${uid} attempting to push to ${dsid}: ${hdata}`)
        v = null
        if (typeof(hdata) == 'object') v = await insertEntry(uid, hdata, dsid)
        else if (typeof(hdata) == 'array') v = await insertMultipleEntries(uid, hdata, dsid)

        if (v == null) res.sendStatus(400)
        else res.sendStatus(200)
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

const createSch = async (req, res) => {
    console.log(req.user.uid)
    uid = req.user.uid
    try {
        const { orgId, type, parameters } = req.body
        if (await createSchema(uid, orgId, type, parameters) != null) {
            res.sendStatus(200)
        } else {
            res.sendStatus(403)
        }

    } catch (error) {
        console.error(error)
        res.sendStatus(403)
    }
}
const createDE = async (req, res) => {
    console.log(req.user.uid)
    uid = req.user.uid
    try {
        const { schemaId } = req.body
        if (await createDsiEntry(uid, schemaId) != null) {
            res.sendStatus(200)
        } else {
            res.sendStatus(403)
        }

    } catch (error) {
        console.error(error)
        res.sendStatus(403)
    }
}


const retreiveDE = async (req, res) => {
    uid = req.user.uid
    log(`uid: ${uid} requesting DE`)
    try {
        const { dsid } = req.body
        log(`uid: ${uid} requesting DE: ${dsid}`)
        const hdata = await getHEntry(uid, dsid)
        if (hdata == null) res.sendStatus(403)
        else res.send(hdata)
    }
    catch (error) {
        log(`ERROR: ${error}`)
        res.sendStatus(500)
    }
}

const retreiveSchemas = async (req, res) => {
    uid = req.user.uid
    log(`uid: ${uid} requesting Schemas`)
    try {
        const { orgId } = req.body
        log(`uid: ${uid} requesting Schemas from: ${orgId}`)
        const schemas = await getSchemas(uid, orgId)
        if (schemas == null) res.sendStatus(403)
        else res.send(schemas)
    }
    catch (error) {
        log(`ERROR: ${error}`)
        res.sendStatus(500)
    }

}

module.exports = { create, ingest, createSch, retreiveSchemas, createDE, retreiveDE}
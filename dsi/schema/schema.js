const { orgCol, userCol, schemaCol, hdataCol} = require("../resources.js")
const { log } = require('../log.js')
const { v4 : uuidv4 } = require('uuid')

const ETYPES = [
    'number',
    'string'
]

const createSchema = async (uid, orgId, type, parameters, manInput=false) => {
    log("Entered schema creation")
    if (parameters.length == 0) {
        log("no params");
        return null
    }
    // check `uid` is valid,
    log("finding user")
    const userFromCol = await userCol.findOne({uid});
    if (userFromCol == null) {
        log("no user exist with uid")
        return null
    }
    // check `uid` part of `orgid`
    console.log(userFromCol.organizations)
    console.log(orgId)
    if (!userFromCol.organizations.includes(orgId)) {
        log("user not in specified organization")
        return null
    }
    log("finding org")
    const org = await orgCol.findOne({orgId})
    if (org == null) { 
        log("organization does not exist")
        return null 
    }
    // TODO: check `type` doesn't exist for `orgid`
    if (org.dtypes.includes(type)) {
        log("data type already exists for organization")
        return null
    }
    const ndsid = uuidv4()
    // create new schema
    newSchema = {
        schemaId: ndsid,
        orgId,
        author: uid,
        type,
        parameters:{},
        manInput
    }
    const invParam = {
        // uid: null,
        // dsid: null,
        // prev: null, 
        // next: null,
        time: null,
    }
    temp = 1
    parameters.forEach(param => {
        console.log(param)
        if (Object.keys(newSchema.parameters).includes(param['name'])){
            log("paramater already specified")
            temp = null
        }
        if (Object.keys(invParam).includes(param['name'])){
            log("invalid key")
            temp = null
        }
        if (!(ETYPES.includes(param['type']))) {
            log("invalid data type")
            temp = null
        }
        newSchema.parameters[param['name']] = param['type']
    });
    if (temp == null) {
        return null
    }
    log("entering schema info")
    // insert schema into dsi collection
    await schemaCol.insertOne(newSchema)
    log("new Schema inserted into dsi schemas")
    // // TODO: update orgCol with schema type 
    await orgCol.updateOne({orgId}, {$push:{dsids: ndsid}})
    log("new Schema dsid updated in org")
    await orgCol.updateOne({orgId}, {$push:{dtypes: type}})
    log("new type updated into org")
    return ndsid
}

const createDsiEntry = async (uid, schemaId, prev = null, next = null) => {
    if (uid == null || schemaId == null) {
        log("invalid params")
        return null
    }
    //find schema entry
    log(`fetching schema ${schemaId}`)
    schema = await schemaCol.findOne({schemaId})
    if (schema == null) {
        log(`schema ${schemaId} not found`)
        return null
    }
    // create new dsi entry
    const dsid = uuidv4()
    nEnt = {
        uid,
        dsid,
        prev, 
        next,
        schemaId,
        params: schema.parameters,
        data: []
    }
    log("pushing schema entry")
    // TODO: push entry to dsi data col
    await hdataCol.insertOne(nEnt)
    log("entering dsid to user")
    // TODO: push dsi entry to user dsids
    await userCol.updateOne({uid}, {$push:{dsids: dsid}})
    return dsid
}

const extendDsiEntry = async (dsid) => {
    if (dsid == null) {
        log("invalid params")
        return null
    }
    const entry = await hdataCol.findOne({dsid})
    if (entry == null) {
        log("dsid does not map to any hdata entry")
        return null
    }
    const { uid, schemaId } = entry
    log("creating new dsi entry")
    const ndsid = await createDsiEntry(uid, schemaId, prev=dsid)

    log("updating dsi entry")
    await hdataCol.updateOne({dsid}, {next:ndsid})

    log("update user object, remove old dsid and insert new")
    await userCol.updateOne({uid}, {$push:{dsids: dsid}})
    await userCol.updateOne({uid}, {$push:{dsids: ndsid}})

    return 1
}


const getSchemas = async (uid, orgId) => {
    if (orgId == null){
        log ("no org specified")
        return []
    }
    // check if user is member of org
    const org = await orgCol.findOne({orgId})
    t = false
    org.members.forEach(member => {
        if (member.uid == uid) t = true
    })
    if (!t) {
        log("user is not part of org")
        return []
    }
    const schemas = await schemaCol.find({orgId}).toArray()
    console.log(schemas)
    return schemas
}



module.exports = { createSchema, createDsiEntry, getSchemas}
const express = require('express')
const Event = require('../models/event')
const auth = require('../middleware/auth')
const blekLevelData = require('../dataProcessing/blekLevelData')
const edgeLevelData = require('../dataProcessing/edgeLevelData')
const unpossibleTimeData = require('../dataProcessing/unpossibleTimeData')
const generateCsv = require('../dataProcessing/csvGenerator')

const router = express.Router()

router.get('/files/blek', async (req, res) => {

    const userIds = await Event.find({gameName: "Blek"}).distinct('userId')
    const actions = userIds.map(async (id) => {
        return await blekLevelData(id)
    });
    
    const result = await Promise.all(actions)
    generateCsv(result, "BlekData", res).send()
})

router.get('/files/unpossible', async (req, res) => {

    const userIds = await Event.find({gameName: "Unpossible"}).distinct('userId')
    const actions = userIds.map(async (id) => {
        return await unpossibleTimeData(id)
    });
    
    const result = await Promise.all(actions)
    generateCsv(result, "UnpossibleData", res).send()
})

router.get('/files/edge', async (req, res) => {

    const userIds = await Event.find({gameName: "Edge"}).distinct('userId')
    const actions = userIds.map(async (id) => {
        return await edgeLevelData(id)
    });
    
    const result = await Promise.all(actions)
    generateCsv(result, "EdgeData", res).send()
})

module.exports = router
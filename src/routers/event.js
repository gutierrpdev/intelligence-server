const express = require('express')
const Event = require('../models/event')
const auth = require('../middleware/auth')
const blekProcess = require('../gameEventHandlers/blek')

const router = express.Router()

router.post('/events', auth, async (req, res) => {
    const user = req.user
    console.log("BODY: " + req.body)
    const event = new Event({...req.body, 'userId': user.userId})
    console.log(event)
    try {
        await event.save()
        res.status(201).send(event)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
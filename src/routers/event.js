const express = require('express')
const Event = require('../models/event')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/events', auth, async (req, res) => {
    const user = req.user
    console.log(JSON.stringify(req.body))
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
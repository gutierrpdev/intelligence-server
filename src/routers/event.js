const express = require('express')
const Event = require('../models/event')
const auth = require('../middleware/auth')
const cors = require('cors')

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

const whitelist = [
    'https://intelligence-assessment-games.herokuapp.com',
    'http://intelligence-assessment-games.herokuapp.com',
    'intelligence-assessment-games.herokuapp.com'
  ]
router.use(cors({
    credentials: true,
    origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }
    } 
}));

module.exports = router
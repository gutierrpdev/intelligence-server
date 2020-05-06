const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

// sign up endpoint
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(user)
    try{
        // try to add new user to database
        await user.save()
        // if user is created correctly, generate a JWT token to 
        // prevent them from having to login again after registration
        const { token, expiration } = await user.generateAuthToken()

        res.cookie('token', token, {
            expires: new Date(Date.now() + expiration),
            secure: true,
            httpOnly: true
        })

        res.status(201).send(user)
    } catch(e) {
        console.log("error: " + e)
        res.status(400).send(e)
    }
})

// login endpoint
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.userId, req.body.password)
        console.log(user)
        const { token, expiration } = await user.generateAuthToken()

        res.cookie('token', token, {
            expires: new Date(Date.now() + expiration),
            secure: true,
            httpOnly: true
        })
        res.send(user)
    } catch (e) {
        console.log("error: " + e)
        res.status(400).send()
    }
})

// logout endpoint
router.post('/users/logout', auth, async (req, res) => {
    try {
        // generate a new version of token list for user
        // without current session's tokens
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        }) 
        await req.user.save()
        res.clearCookie('token')
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// logout endpoint
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // remove all access tokens
        req.user.tokens = []
        await req.user.save()
        res.clearCookie('token')
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if(user){
            return res.status(200).send(user)
        } 
        res.status(404).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['password', 'age', 'blekCompleted', 'edgeCompleted', 'unpossibleCompleted', 'knowsBlek', 'knowsEdge', 'knowsUnpossible', 'questionsCompleted']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid update fields requested'})
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
        
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router
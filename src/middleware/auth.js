const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || ''
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ userId : decoded.userId})
        
        if(!user){
            throw new Error()
        }

        // store fetched user within request in order to save resources later on
        // do the same thing with the authorization token
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({error : 'Please authenticate'})
    }
}

module.exports = auth
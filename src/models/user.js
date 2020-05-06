const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    blekCompleted: {
        type: Boolean,
        default: false
    },
    edgeCompleted: {
        type: Boolean,
        default: false
    },
    unpossibleCompleted: {
        type: Boolean,
        default: false
    },
    knowsBlek: {
        type: Boolean
    },
    knowsEdge: {
        type: Boolean
    },
    knowsUnpossible: {
        type: Boolean
    },
    questionsCompleted: {
        type: Boolean
    },
    userId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        required: true,
        validate(value){
            if(!Number.isInteger(value)){
                throw new Error('Age must be an integer')
            }
            else if(value < 0){
                throw new Error('Age must be a non-negative integer value')
            }
            else if(value > 120){
                throw new Error('Age must be lower than 120')
            }
        }
    },
    gender: {
        type: String,
        required: true,
        validate(value){
            if(value.toLowerCase() !== 'male' && value.toLowerCase() !== 'female'){
                throw new Error('Gender must be either Male or Female')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]    
});

userSchema.virtual('events', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'owner'
})

// expose just a limited profile with relevant, public data
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject._id

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000
    const token = jwt.sign({'userId' : user.userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.DB_ENV === 'testing' ? '1d' : '7d',
    })

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return { token, expiration }
}

userSchema.statics.findByCredentials = async (userId, password) => {
    const user = await User.findOne({userId})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User;
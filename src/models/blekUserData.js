const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blekUserDataSchema = new Schema({
    levelData: [{
        levelTime: {
            type: Number,
            required: true,
            default: 0
        },
        curveCount: {
            type: Number,
            required: true,
            default: 0
        },
        thinkingTime: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    owner: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('BlekUserData', blekUserDataSchema);
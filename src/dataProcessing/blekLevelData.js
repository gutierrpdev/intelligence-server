const Event = require('../models/event');

/**
 * For a given userId, generate entries representing time spent by such user on each level they reached
 * @param {*} userId userID whose events we want to retrieve.
 */
const blekLevelData = async (userId) => {

    const events = await Event.find({userId, gameName: 'Blek'})
    events.sort((a, b) => {
        if(a.timestamp < b.timestamp) return -1
        if(a.timestamp > b.timestamp) return 1
        if(a.orderInSequence < b.orderInSequence) return -1
        if(a.orderInSequence > b.orderInSequence) return 1
        return 0
    })

    // results with user's times.
    let result = {'_userId' : userId}
    // level number
    let counter = 0
    // level set tag
    let tag = 'Blek_Tut_'
    // level start timestamp
    let levelStart = null

    // events are sorted by timestamp in ascending order.
    for(let i = 0; i < events.length; i++){
        switch(events[i].name){
            case 'TUTORIAL_START':
                // Set tag accordingly.
                tag = 'Blek_Tut_'
                result = {'_userId' : userId}
                break
            case 'TUTORIAL_END':
                // do nothing.
                break
            case 'EXPERIMENT_START':
                // update tag.
                tag = 'Blek_Exp_'
                break
            case 'EXPERIMENT_END':
                // do nothing.
                return result
                break
            case 'LEVEL_START':
                // update counter to reflect current level.
                counter = parseInt(events[i].parameters[0].value)
                // store start timestamp
                levelStart = events[i].timestamp
                break
            case 'LEVEL_END':
                // reached level end for current level.
                if(parseInt(events[i].parameters[0].value) === counter){
                    result[tag + 'Time_' + counter] = events[i].timestamp - levelStart
                    levelStart = null
                }
                break
            case 'FIRST_TOUCH':
                if(!result[tag + 'Think_' + counter]){
                    result[tag + 'Think_' + counter] = events[i].timestamp - levelStart
                }
                break
            case 'BEGIN_DRAWING':
                if((tag + 'Curves' + counter) in result){
                    result[tag + 'Curves_' + counter] += 1
                }
                else{
                    result[tag + 'Curves_' + counter] = 1
                }
                break 
        }
    }
    
    return result
}

module.exports = blekLevelData
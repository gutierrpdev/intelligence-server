const Event = require('../models/event');

/**
 * For a given userId, generate entries representing time spent by such user on each level they reached
 * plus the number of deaths and collectibles found within the level.
 * @param {*} userId userID whose events we want to retrieve.
 */
const edgeLevelData = async (userId) => {
    
    const events = await Event.find({userId, gameName: 'Edge'})
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
    let tag = 'Edge_Tut_'
    // level start timestamp
    let levelStart = null

    // events are sorted by timestamp in ascending order.
    for(let i = 0; i < events.length; i++){
        switch(events[i].name){
            case 'TUTORIAL_START':
                // Set tag accordingly.
                result = {'_userId' : userId}
                tag = 'Edge_Tut_'
                break;
            case 'TUTORIAL_END':
                // do nothing.
                break;
            case 'EXPERIMENT_START':
                // update tag.
                tag = 'Edge_Exp_'
                break
            case 'EXPERIMENT_END':
                result['Score'] = events[i].parameters[0].value
                return result
            case 'PLAYER_DEATH':
                // add a death to death field
                if((tag + 'Deaths_' + counter) in result){
                    result[tag + 'Deaths_' + counter] += 1
                }
                else result[tag + 'Deaths_' + counter] = 1
                break
            case 'GOT_ITEM':
                // add an item to prisms field
                if((tag + 'Prisms_' + counter) in result){
                    result[tag + 'Prisms_' + counter] += 1
                }
                else result[tag + 'Prisms_' + counter] = 1
                break
            case 'LEVEL_START':
                // update counter to reflect current level.
                counter = parseInt(events[i].parameters[0].value)
                // store start timestamp
                levelStart = events[i].timestamp
                result[tag + 'Deaths_' + counter] = 0
                result[tag + 'Prisms_' + counter] = 0
                break
            case 'LEVEL_END':
                // reached level end for current level.
                if(parseInt(events[i].parameters[0].value) == counter){
                    result[tag + 'Time_' + counter] = events[i].timestamp - levelStart
                    result[tag + 'NumMoves_' + counter] = events[i].parameters[1].value
                    levelStart = null
                }
                break
            case 'GOT_CHECKPOINT':
                // add a checkpoint to prisms field
                if((tag + 'Checkpoints' + counter) in result){
                    result[tag + 'Checkpoints' + counter] += 1
                }
                else result[tag + 'Checkpoints' + counter] = 1
                break
        }
    }
    return result
}

module.exports = edgeLevelData
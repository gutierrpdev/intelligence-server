const Event = require('../models/event')

/**
 * For a given userId, generate entries representing time spent by such user on a given try.
 * @param {*} userId userID whose events we want to retrieve.
 */
const unpossibleTimeData = async (userId) => {

    // find user's events.
    const events = await Event.find({userId, gameName: 'Unpossible'})

    // results with user's times.
    let result = {'_userId' : userId}
    // try number
    let counter = 1
    // level set tag
    let tag = 'Unp_Tut_'
    // max time player survived
    let maxTime = 0

    // events are sorted by timestamp in ascending order.
    for(let i = 0; i < events.length; i++){
        switch(events[i].name){
            case 'TUTORIAL_START':
                // reset counter and set tag accordingly.
                counter = 1
                maxTime = 0
                tag = 'Unp_Tut_'
                break
            case 'TUTORIAL_END':
                if(i > 0){
                    // player managed to complete tutorial without dying.
                    if(events[i - 1].name == 'TUTORIAL_START'){
                        // direct calculation.
                        let tryTime = events[i].timestamp - events[i-1].timestamp
                        result[tag + counter] = tryTime
                        result[tag + 'maxTime'] = tryTime
                    }
                    // player dies within tutorial.
                    else if(events[i - 1].name == 'PLAYER_DEATH'){
                        // add time for try and advance counter (3 seconds must be subtracted).
                        let tryTime = events[i].timestamp - events[i-1].timestamp - 3
                        maxTime = Math.max(tryTime, maxTime)
                        result[tag + counter] = tryTime
                        result[tag + 'maxTime'] = maxTime
                    }
                }
                break
            case 'EXPERIMENT_START':
                // reset counter and update tag
                counter = 1
                maxTime = 0
                tag = 'Unp_Exp_'
                break
            case 'EXPERIMENT_END':
                if(i > 0){
                    // player managed to complete experiment without dying.
                    if(events[i - 1].name == 'EXPERIMENT_START'){
                        // direct calculation.
                        let tryTime = events[i].timestamp - events[i-1].timestamp
                        result[tag + counter] = tryTime
                        result[tag + 'maxTime'] = tryTime
                    }
                    // player dies within experiment.
                    else if(events[i - 1].name == 'PLAYER_DEATH'){
                        // add time for try and advance counter (3 seconds must be subtracted).
                        let tryTime = events[i].timestamp - events[i-1].timestamp - 3
                        maxTime = Math.max(tryTime, maxTime)
                        result[tag + counter] = tryTime
                        result[tag + 'maxTime'] = maxTime                       
                    }
                }
                break
            case 'PLAYER_DEATH':
                if(i > 0){
                    // player dies for the first time
                    if(events[i - 1].name == 'TUTORIAL_START' ||
                        events[i - 1].name == 'EXPERIMENT_START' ){
                        // direct calculation.
                        let tryTime = events[i].timestamp - events[i-1].timestamp
                        result[tag + counter] = tryTime
                        maxTime = tryTime                            
                        counter += 1
                    }
                    // player dies again.
                    else if(events[i - 1].name == 'PLAYER_DEATH'){
                        // add time for try and advance counter (3 seconds must be subtracted).
                        let tryTime = events[i].timestamp - events[i-1].timestamp - 3
                        result[tag + counter] = tryTime
                        maxTime = Math.max(tryTime, maxTime)
                        counter += 1
                    }
                }
                break
        }
    }
    return result
}

module.exports = unpossibleTimeData
// const BlekUserData = require('../models/blekUserData')

// // stores session data for each user currently playing the game.
// var blekSessions = new Map()

// const processEvent = async (event) => {

//     // init session for event's owner
//     if(!blekSessions.has(event.owner)){
//         blekSessions.set(event.owner, {
//             levelTag: '',
//             levelStart: 0,
//             levelCurveCount: 0,
//             levelFirstTouch: 0
//         })
//     }

//     // load current session
//     let session = blekSessions.get(event.owner)

//     switch(event.name){
//         case 'TUTORIAL_START':
//             // Set tag accordingly.
//             session.levelTag = 'Blek_Tut_'
//             break
//         case 'TUTORIAL_END':
//             // remove session entry
//             blekSessions.delete(event.owner)
//             break
//         case 'EXPERIMENT_START':
//             // update tag.
//             session.levelTag = 'Blek_Exp_'
//             break
//         case 'EXPERIMENT_END':
//             // remove session entry
//             blekSessions.delete(event.owner)
//             break
//         case 'LEVEL_START':
//             // update counter to reflect current level.
//             session.levelNumber = parseInt(event.parameters[0].value)
//             // store start timestamp
//             session.levelStart = event.timestamp
//             break
//         case 'LEVEL_END':
//             // reached level end for current level.
//             if(parseInt(event.parameters[0].value) === session.levelNumber){
//                 let userData = await BlekUserData.findOne({ owner : event.owner })

//                 // add new level entry
//                 userData.levelData.push({
//                     levelTime: event.timestamp - session.levelStart,
//                     curveCount: session.levelCurveCount,
//                     thinkingTime: session.levelFirstTouch - session.levelStart
//                 })

//                 // save new level data
//                 await userData.save()
//             }
//             // reset session for new level
//             blekSessions.set(event.owner, {
//                 levelTag: '',
//                 levelStart: 0,
//                 levelCurveCount: 0,
//                 levelFirstTouch: 0
//             })
//             break
//         case 'FIRST_TOUCH':
//             session.levelFirstTouch = event.timestamp
//             session.curveCount = 0
//             break
//         case 'BEGIN_DRAWING':
//             session.curveCount += 1
//             break
//         default: break
//     }

//     return
// }

// module.exports = processEvent
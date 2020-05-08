const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');

// initialise mongoose and get it running
require('./db/mongoose')

// require routers for express
const userRouter = require('./routers/user')
const eventRouter = require('./routers/event')
const fileRouter = require('./routers/file')
//const frontendRouter = require('./routers/frontend')

// express app init
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())

const whitelist = [
  'https://intelligence-assessment-games.herokuapp.com',
  'http://intelligence-assessment-games.herokuapp.com',
  'intelligence-assessment-games.herokuapp.com',
  'http://localhost:3001'
]
app.use(cors({
    credentials: true,
    origin: function(origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    } 
  }));

// register routers
app.use(userRouter)
app.use(eventRouter)
app.use(fileRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})
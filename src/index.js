const express = require('express')
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


// register routers
app.use(userRouter)
app.use(eventRouter)
app.use(fileRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})
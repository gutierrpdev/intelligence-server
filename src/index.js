const path = require('path')
const express = require('express')
const hbs = require('hbs')
const cors = require('cors');
const cookieParser = require('cookie-parser');

// initialise mongoose and get it running
require('./db/mongoose')

const auth = require('./middleware/auth')

// require routers for express
const userRouter = require('./routers/user')
const eventRouter = require('./routers/event')
const fileRouter = require('./routers/file')
//const frontendRouter = require('./routers/frontend')

// express app init
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(cors({credentials: true}));

// register routers
app.use(userRouter)
app.use(eventRouter)
app.use(fileRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})
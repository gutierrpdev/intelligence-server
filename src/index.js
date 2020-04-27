const path = require('path')
const express = require('express')
const hbs = require('hbs')

// initialise mongoose and get it running
require('./db/mongoose')

// require routers for express
const userRouter = require('./routers/user')
const eventRouter = require('./routers/event')
const fileRouter = require('./routers/file')

// express app init
const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())

// register routers
app.use(userRouter)
app.use(eventRouter)
app.use(fileRouter)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Intelligence Assessment'
    })
})

app.get('/data', (req, res)=>{
    res.render('data', {title: 'Data Files'})
})

app.get('/blek', (req, res)=>{
    res.render('blek')
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})
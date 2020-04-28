const express = require('express')
const auth = require('../middleware/auth')

const router = express.Router()

router.set('view engine', 'hbs')

router.get('', auth, (req, res) => {
    res.render('index', {
        title: 'Intelligence Assessment'
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Intelligence Assessment'
    })
})

router.get('/data', auth, (req, res)=>{
    res.render('data', {title: 'Data Files'})
})

router.get('/blek', auth, (req, res)=>{
    res.render('blek')
})

router.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found.'
    })
})

module.exports = router
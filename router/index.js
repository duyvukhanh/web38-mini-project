const express = require('express')

const musicRouter = require('./music')
const categoryRouter = require('./category')

const router = new express.Router()

router.use('/api/music', musicRouter)
router.use('/api/category', categoryRouter)


module.exports = router
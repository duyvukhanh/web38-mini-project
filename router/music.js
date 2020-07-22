const express = require('express')
const musicHandlers = require('../modules/music')


const musicRouter = new express.Router()

musicRouter.get('/', musicHandlers.findMany)

musicRouter.get('/:id', musicHandlers.findOne)

musicRouter.post('/', musicHandlers.create)

musicRouter.put('/', musicHandlers.update)

musicRouter.delete('/:id', musicHandlers.delete)

musicRouter.get('/count/docs', musicHandlers.countDocuments)


module.exports = musicRouter
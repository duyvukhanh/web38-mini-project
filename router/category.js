const express = require('express')
const categoryHandlers = require('../modules/category')

const categoryRouter = new express.Router()

categoryRouter.get('/', categoryHandlers.findMany)

categoryRouter.get('/:id', categoryHandlers.findOne)

categoryRouter.post('/', categoryHandlers.create)

categoryRouter.put('/', categoryHandlers.update)

categoryRouter.delete('/:id', categoryHandlers.delete)

module.exports = categoryRouter
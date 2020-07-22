const mongoose = require('mongoose')

const musicSchema = require('./schema')
const COLLECTION_NAME = 'music'
const MODEL_NAME = 'music'

const musicModel = mongoose.model(MODEL_NAME, musicSchema, COLLECTION_NAME)

// productModel.countDocuments()
// productModel.find()
// productModel.findOne()
// productModel.create()
// productModel.findByIdAndUpdate()
// productModel.findByIdAndRemove()

module.exports = musicModel
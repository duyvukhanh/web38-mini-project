const mongoose = require('mongoose')

const categorySchema = require('./schema')
const COLLECTION_NAME = 'categories'
const MODEL_NAME = 'categories'

const categoryModel = mongoose.model(MODEL_NAME, categorySchema, COLLECTION_NAME)

// productModel.countDocuments()
// productModel.find()
// productModel.findOne()
// productModel.create()
// productModel.findByIdAndUpdate()
// productModel.findByIdAndRemove()

module.exports = categoryModel
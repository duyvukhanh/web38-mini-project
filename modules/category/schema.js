const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  title: {
    type: String,
    required: [true, `Yêu cầu 'title'!`],
    unique: true,
  },
  description: String,
})

module.exports = categorySchema
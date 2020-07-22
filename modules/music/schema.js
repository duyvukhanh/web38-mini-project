const mongoose = require('mongoose')
const Schema = mongoose.Schema

// String, Number, Boolean, Date, Object, Array, ObjectId
const musicSchema = new Schema({
  // _id: ObjectId
  title: {
    type: String,
    required: [true, `Yêu cầu 'title'!`],
  },
  artist: {
    type: String,
    required: [true, `Yêu cầu 'artist'!`],
  },
  url: {
    type: String,
    required: [true, `Yêu cầu 'url'!`],
    unique: true
  },
  image: {
    type: String,
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'categories'
    }
  ]
})

module.exports = musicSchema
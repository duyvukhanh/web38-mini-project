const musicModel = require('./model')
const { countDocuments } = require('./model')
const mongoose = require('mongoose')

const handlers = {
  async findMany(req, res, next) {
    try {
      let {
        pageIndex,
        pageSize,
        sortBy,
        sort, // asc | desc
        search = '',
        fields = '',
        artist,
        except = '',
        category,
        random,
      } = req.query
      pageSize = parseInt(pageSize) || 8
      pageIndex = parseInt(pageIndex) || 1

      let limit = pageSize
      let skip =  (pageIndex - 1) * pageSize
      let sortInfo = `${sort == 'desc' ? '-' : ''}${sortBy}`
      // fields = 'title, description' > fieldArr = ['title', 'description']
      let fieldArr = fields.split(',').map(field => field.trim())
      let conditions = {}
      let exceptArr = except.split(',').map(except => except.trim())
      if ( search ) {
        conditions.title = new RegExp(search, 'i')
      }
      if ( except ) {
        conditions._id = {}
        conditions._id.$nin = exceptArr
      }
      if ( artist ) {
        conditions.artist = new RegExp(artist, 'i')
      }
      if ( category ) {
        conditions.categories = {}
        conditions.categories.$in = [category]
      }
      // console.log(conditions)
      let items = await musicModel
      .find( conditions , fieldArr)
      .skip(skip)
      .limit(limit)
      .sort(sortInfo)
      .populate('categories', ['title'])

      res.json(items)
    } catch(err) {
      next(err)
    }
  },
  async findOne(req, res, next) {
    try {
      let id = req.params.id
      let prevTrackId = req.query.prev || mongoose.Types.ObjectId()
      let item= await musicModel
      .findById(id)
      .lean()
      .populate('categories', ['title'])

      let itemGenre = item.categories[0]
      let itemsSameGenre = await musicModel.find( { categories : { $in : [itemGenre] } } )
      let numberOfDocs = itemsSameGenre.length - 3
      let random = Math.floor(Math.random() * numberOfDocs);
      
      let nextItems = await musicModel
      .find( { 
        categories : { $in : [itemGenre] },
        _id : { $nin : [id,prevTrackId] }
      } )
      .skip(random)
      .limit(3)
      .populate('categories', ['title'])

      let nextTrack = []
      
      for ( let track of nextItems ) {
        nextTrack.push(track)
      }      

      item.nextTrack = nextTrack
      res.json(item)

    } catch(err) {
      next(err)
    }
  },
  async create(req, res, next) {
    try {
      let data = req.body // { title: '123', description: '123' }
      let item = await musicModel.create(data) // { _id: '', title, description }
      res.json(item)
    } catch(err) {
      next(err)
    }
  },
  async update(req, res, next) {
    try {
      let data = req.body
      let id = req.body._id

      if(!id) {
        throw new Error(`Require 'id' to update!`)
      }

      let item = await musicModel.findByIdAndUpdate(
        id,
        data,
        { new: true }
      )
      res.json(item)
    } catch(err) {
      next(err)
    }
  },
  async delete(req, res, next) {
    try {
      let id = req.params.id
      let item = await musicModel.findByIdAndDelete(id)
      res.json(item)
    } catch(err) {
      next(err)
    }
  },
  async countDocuments(req, res, next) {
    try {
      let count = await musicModel.count()
      console.log(count)
      res.json(count)
    } catch(err) {
      next(err)
    }
  }
}

module.exports = handlers

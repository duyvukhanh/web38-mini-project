const categoryModel = require('./model')

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
      } = req.query

      pageSize = parseInt(pageSize) || 20
      pageIndex = parseInt(pageIndex) || 1

      let limit = pageSize
      let skip =  (pageIndex - 1) * pageSize
      let sortInfo = `${sort == 'desc' ? '-' : ''}${sortBy}`
      // fields = 'title, description' > fieldArr = ['title', 'description']
      let fieldArr = fields.split(',').map(field => field.trim())
      let conditions = {}
      if ( search ) {
        conditions.title = new RegExp(search, 'i')
      }

      let items = await categoryModel
      .find( conditions , fieldArr)
      .skip(skip)
      .limit(limit)
      .sort(sortInfo)

      res.json(items)
    } catch(err) {
      next(err)
    }
  },
  async findOne(req, res, next) {
    try {
      let id = req.params.id
      let item = await categoryModel.findById(id)
      res.json(item)
    } catch(err) {
      next(err)
    }
  },
  async create(req, res, next) {
    try {
      let data = req.body // { title: '123', description: '123' }
      let item = await categoryModel.create(data) // { _id: '', title, description }
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

      let item = await categoryModel.findByIdAndUpdate(
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
      let item = await categoryModel.findByIdAndDelete(id)
      res.json(item)
    } catch(err) {
      next(err)
    }
  }
}

module.exports = handlers

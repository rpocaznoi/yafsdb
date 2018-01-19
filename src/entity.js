const fs = require('fs')
  , uuidv4 = require('uuid/v4')
  , _ = require('lodash')

class entity {

  constructor(name) {
    this.fname = name + '.json'
    if (!fs.existsSync(this.fname)) {
      fs.writeFileSync(this.fname, '[]', 'utf-8')
    }

    this.getOne = this.getOne.bind(this)
    this.getAll = this.getAll.bind(this)
    this.insert = this.insert.bind(this)
    this.upsert = this.upsert.bind(this)
    this.update = this.update.bind(this)
    this.remove = this.remove.bind(this)
    this.removeAll = this.removeAll.bind(this)

  }

  getOne(criterion) {
    const data = JSON.parse(fs.readFileSync(this.fname, 'utf-8'))
      , index = _.findIndex(data, criterion)
    return -1 === index ? null : data[index]
  }

  getAll(criterion) {
    const data = JSON.parse(fs.readFileSync(this.fname, 'utf-8'))
      , found = _.filter(data, criterion)
    return found
  }

  insert(object) {
    let data = JSON.parse(fs.readFileSync(this.fname, 'utf-8'))
    object._id = uuidv4().replace('-', '')
    data.push(object)
    fs.writeFileSync(this.fname, JSON.stringify(data))
    return object
  }

  upsert(object) {
    if (object._id) {
      return this.update(object)
    } else {
      const existing = this.getOne(object)
      if (existing) {
        return this.update(object)
      }
      return this.insert(object)
    }
  }

  update(object) {
    if (object._id) {
      let data = JSON.parse(fs.readFileSync(this.fname, 'utf-8'))
      const index = _.findIndex(data, { _id: object._id })
      if (-1 === index) {
        return null
      } else {
        data[index] = Object.assign({}, data[index], object)
      }
      fs.writeFileSync(this.fname, JSON.stringify(data))
      return data[index]
    } else {
      return null
    }
  }

  remove(objectOrId) {
    let _id = objectOrId
    if (typeof objectOrId === 'object') {
      _id = objectOrId._id
    }
    if (!_id) {
      console.log('object not found')
      return null
    }
    let data = JSON.parse(fs.readFileSync(this.fname, 'utf-8'))
    const index = _.findIndex(data, { _id })
      , toBeDeleted = data.splice(index, 1)
    fs.writeFileSync(this.fname, JSON.stringify(data))
    return toBeDeleted
  }

  removeAll(criterion) {
    const data = JSON.parse(fs.readFileSync(this.fname, 'utf-8'))
      , found = _.filter(data, criterion)
    if (found) {
      const newData = _.without(data, found)
      fs.writeFileSync(this.fname, JSON.stringify(newData))
    }
    return found
  }
}

module.exports = (name) => new entity(name)
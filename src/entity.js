const fs = require('fs')
  , uuidv4 = require('uuid/v4')
  , _ = require('lodash')

class entity {

  constructor(name) {
    this.fname = name + '.json'
    if (!fs.existsSync(this.fname)) {
      fs.writeFileSync(this.fname, '[]', 'utf-8')
    }
    this.write = this.write.bind(this)
    this.getOne = this.getOne.bind(this)
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
  write(object) {

    let data = JSON.parse(fs.readFileSync(this.fname, 'utf-8'))
    if (object._id) {
      const index = _.findIndex(data, { _id: object._id })
      if (-1 === index) {
        data.push(object)
      } else {
        data[index] = object
      }
    } else {
      object._id = uuidv4().replace('-', '')
      data.push(object)
    }
    fs.writeFileSync(this.fname, JSON.stringify(data))
    return object
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
    if(found) {
      const newData = _.without(data, found)
      fs.writeFileSync(this.fname, JSON.stringify(newData))
    }
    return found
  }
}

module.exports = (name) => new entity(name)
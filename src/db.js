const fs = require('fs')
  , { createEntity } = require('./entity')
  , _ = require('lodash')

class fsdb {

  constructor(options) {
    const { datadir, entities } = options
    this.datadir = datadir
    let optionsEntityNames = [], entityCreatorsMap = {}

    if (entities) {
      if (typeof entities === 'array') {
        optionsEntityNames = entities
      } else if (typeof entities === 'object') {
        optionsEntityNames = Object.keys(entities)
        entityCreatorsMap = entities
      }
    }

    if (!fs.existsSync(datadir))
      fs.mkdirSync(datadir)
    const entitiesInDataDir = fs.readdirSync(datadir).map(f => f.replace(/(.*)\.json/, '$1'))
      , allEntityNames = _.union(optionsEntityNames, entitiesInDataDir).filter(e => e !== 'ensure')

    if (allEntityNames.length) {
      allEntityNames.forEach(entity => {
        if (entityCreatorsMap[entity] && typeof entityCreatorsMap[entity] === 'function') {
          this[entity] = entityCreatorsMap[entity](`${this.datadir}/${entity}`, this)
        } else {
          this[entity] = createEntity(`${this.datadir}/${entity}`, this)
        }
      })
    }
  }

  ensure(entity) {
    if (!this[entity]) {
      this[entity] = createEntity(`${this.datadir}/${entity}`, this)
    }
    return this[entity]
  }

}

module.exports = {
  createDb: (options) => {
    const { datadir: optionsDataDir, entities } = options
      , datadir = optionsDataDir || 'yafsdbdata'
    return new fsdb({ datadir, entities })
  },
  fsdb
}
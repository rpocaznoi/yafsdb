const fs = require('fs')
  , createEntity = require('./entity')
  , _ = require('lodash')

class fsdb {

  constructor(options) {
    const { datadir, entities } = options
    this.datadir = datadir
    if (!fs.existsSync(datadir))
      fs.mkdirSync(datadir)
    const entitiesInDataDir = fs.readdirSync(datadir).map(f => f.replace(/(.*)\.json/, '$1'))
      , all = _.union(entities, entitiesInDataDir).filter(e => e !== 'ensure')

    if (all.length) {
      all.forEach(entity => {
        this[entity] = createEntity(`${this.datadir}/${entity}`)
      })
    }
  }

  ensure(entity) {
    if (!this[entity]) {
      this[entity] = createEntity(`${this.datadir}/${entity}`)
    }
    return this[entity]
  }

}

module.exports = (options) => {
  const { datadir: optionsDataDir, entities } = options
    , datadir = optionsDataDir || 'yafsdbdata'
  return new fsdb({ datadir, entities })
}
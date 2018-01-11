const fs = require('fs')
, createEntity = require('./entity')
class fsdb {

  constructor(options) {
    const { datadir } = options
    this.datadir = datadir
    if(!fs.existsSync(datadir))
      fs.mkdirSync(datadir)
    this.entities = fs.readdirSync(datadir)
  }

  ensure(entity) {
    if(!this.entities[entity]){
      this.entities[entity] = createEntity(`${this.datadir}/${entity}`)
    }
    return this.entities[entity]
  }

}

module.exports = (options) => {
  const { datadir: optionsDataDir } = options
    , datadir = optionsDataDir || 'yafsdbdata'
  return new fsdb({datadir})
}
'use strict'
// @copyright https://gitlab.com/djencks/asciidoctor-openblock/-/blob/master/lib/openblock.js

const Opal = global.Opal

var toHash = function (object) {
  return object && !object.$$is_hash ? Opal.hash2(Object.keys(object), object) : object
}

module.exports.register = function (registry, config = {}) {
  function openblockBlock () {
    const self = this
    self.named('openblock')
    self.onContext(['listing', 'paragraph'])
    self.positionalAttributes(['role'])
    self.process(function (parent, reader, attributes) {
      const result = self.$create_open_block(parent, [], toHash(attributes))
      delete attributes.role
      self.parseContent(result, reader, toHash(attributes))
      return result
    })
  }

  function doRegister (registry) {
    if (typeof registry.block === 'function') {
      registry.block(openblockBlock)
    } else {
      console.warn('no \'block\' method on alleged registry')
    }
  }

  if (typeof registry.register === 'function') {
    registry.register(function () {
      //Capture the global registry so processors can register more extensions.
      registry = this
      doRegister(registry)
    })
  } else {
    doRegister(registry)
  }
  return registry
}

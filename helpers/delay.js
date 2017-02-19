const Promise = require('bluebird')

const delay = (ms) => {
  const deferred = Promise.pending()

  setTimeout(() => {
    deferred.resolve()
  }, ms)

  return deferred.promise
}

module.exports = delay

/* global contract, Token, before */

contract('Token', function (accounts) {
  let wings
  let creator

  before('Initialize Wings contract', (done) => {
    creator = accounts[0]

    Token.new({
      from: creator
    }).then((_wings) => {
      wings = _wings
    }).then(done).catch(done)
  })
})

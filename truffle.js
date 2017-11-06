// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      host:"localhost",
      port: 8545,
      from: "0xbfdc81525baa065a28b9eb10e373ee168335d768",
      network_id: 4,
      gas: 4612388
    }
  }
}
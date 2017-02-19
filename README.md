# WINGS Smart Contracts [![standard][standard-image]][standard-url] [![travis][travis-image]][travis-url]

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[travis-image]: https://img.shields.io/travis/wingsdao/contracts.svg
[travis-url]: https://travis-ci.org/wingsdao/contracts

> **Warning:** This is an ***alpha*** version of the Wings DAO platform contracts, intended to run on `devnet` and `testnet` blockchains.
>
> * ***Do not*** use this on the `mainnet` blockchain.
>
> * ***Do not*** send `mainnet` cryptocurrencies to addresses generated on the `devnet`.


## Prerequisites

* Node.js (~6.9.0)
* testrpc


## Development

Fork the repo and then;

    git clone git@github.com:<YOUR_GITHUB_USERNAME>/contracts.git
    cd contracts && npm install


## Setup

Copy `truffle.example.js` to `truffle.js`

    cp truffle.example.js truffle.js

Configure `truffle.js` to match your local Ethereum node configuration.

> Don't add `truffle.js` to repository. It is already set to ignore by git.


## Build contracts

    npm run build


### Deployment of contracts

    npm run migrate

or

    npm run reset-migrate


### Tests

To run `standard` and `truffle` tests;

    npm test


## License

Copyright 2017 © Wings Stiftung. All right reserved.

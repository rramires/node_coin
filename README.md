# NodeCoin
## Experimental Cryptocurrency - Made with NodeJs

[![ISC License](http://img.shields.io/badge/license-ISC-blue.svg)](http://copyfree.org)

Developed with the sole purpose of learning the minimum operation of a cryptocurrency.


### Development

```sh
# Cloning repository
$ git git@github.com:rramires/node_coin.git
$ cd node_coin
$ npm install

# Automated Tests
$ npm run test

# Running instances
# 1st instance
$ npm run dev

# 2nd instance
http_port=3002 p2p_port=5002 peers=ws://localhost:5001 npm run dev

# 3rd instance
http_port=3003 p2p_port=5003 peers=ws://localhost:5001,ws://localhost:5002 npm run dev

```
#### HTTP Server
Provides an API to manage the blockchain, wallets, addresses, transaction creation and mining

##### Blockchain

|Method|URL|Description|
|------|---|-----------|
|GET|/blocks|Get all blocks|
|GET|/transactions|Get all transactions in mempool|
|GET|/mine-transactions|It takes the transactions in mempool, writes to a new block and returns it|

##### Wallet

|Method|URL|Description|
|------|---|-----------|
|GET|/public-key|Get wallet publick key|
|POST|/transact|Create a new transaction - Send JSON { "recipient": "destination public key", "amount": 10 }|
|GET|/get-balance|Get current instance balance|


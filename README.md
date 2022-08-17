`#Ethereum`

# AZUKI - NFT Marketplace

This is an open decentralized NFT Marketplace built with smart contracts powered by Ethereum. It basically consists in an open platform where each user can mint his own NFT and expose it on a marketplace.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

First, you will need to install the dependencies with: `npm install`.

```
$ npm install
```

Then, you will need to install Truffle globally by running the following command int your terminal:

```
$ npm install -g truffle
```

### Running the Tests

First, you will have to compile the smart contracts by running the following command in your terminal:

```
$ truffle compile
```

Then you will have to install and run Ganache to run your blockchain locally:

https://www.trufflesuite.com/ganache

Then, the tests that validate your solution can be executed by runing the following
command:

```
$ truffle test
```

### Deployment on Local Blockchain

Deploy the contracts on your Ganache local blockchain by running the following command:

```
$ truffle migrate
```

### Opening the User Interface

First of all, it is required to install Metamask wallet as a browser extension: https://metamask.io/

Then you should configure Metamask to connect to your local blockchain run by Ganache. This requires the following:
- Open Metamask
- Open the Network Configuration panel
- Open Custom RPC
- Configure your private network by adding `http://localhost:8545` on the URL and `1337` as a chain ID.
- Import the first Ganache Account to Metamask by copying the Account Private Key from Ganache and pasting it on Metamask

Finally you just need to run the following command in your terminal to open the User Interface:

```
$ npm start
```

### Deployment on Public Network

In order to deploy your smart contract, you must create your .env file and specify:

- `PRIVATE_KEYS` --> Private Key of the account you are using to deploy (typically the first one in the list of Ganache)
- `INFURA_API_KEY` --> API key provided by Infura: https://infura.io

Then, you will need to run the following command (let's use the testnet Ropsten in this example, remember to request some Ether for your account using a faucet):

```
$ truffle migrate --network ropsten --reset
```

Finally you can run the following command to generate the build artifacts of your User Interface and then deploy to your favourite host:

```
npm run build
```
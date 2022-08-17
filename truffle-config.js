require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonic = "middle ten below angle you detect easily flock danger badge hobby federal";
 
module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" //match any network id
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`),
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      addressIndex: 2,
      network_id: 3
    }
  },
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abis',

  // Configure your compilers
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      version: "^0.8.0" 
    }
  }
};
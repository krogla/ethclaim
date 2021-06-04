require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY"
      },
      gasPrice: 100000000000, //100gwei
    },
    testnet: {
      url: "https://eth-goerli.alchemyapi.io/v2/YOUR_KEY",
      chainId: 5,
      gasPrice: 10000000000,
      accounts: { mnemonic: "" }
    },
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY",
      chainId: 1,
      gasPrice: 100000000000,
      accounts: { mnemonic: "" }
    }
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200000
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};


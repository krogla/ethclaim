# claim eth from wrong address

We were very lucky that no one transaction was made on the mainnet from the account that was used for deployment on the testnet.

This allows to recreate a sequence of transactions in the mainnet, and as a result, the reproduction of the same contract addresses as in the testnet.

A small research of the process of deploying contracts, showed that it is possible to return Ether from the wrong address, while spending no more than 0.2ETH (with gasPrice = 30gwei)!

The repository contains a script and contracts that simulate the sequence of calls on the mainnet fork.

>Scripts for launching on the mainnet are still in the WIP stage.

## requirements

1. nodejs v.14
  
## prep

1. install deps: `npm i`
  
## test run on mainnet fork

1. start forked ETH node: `npx hardhat node`
2. run script: `npx hardhat run scripts/claim-test.js`

### output

![test output](output.jpg?raw=true "output")
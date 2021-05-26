const { ethers, network } = require("hardhat");
const config = require('../hardhat.config')
const ownerAddress = "0x8303B3A462F4Cb4d2468DDcBD4c9f212914A3a7F"
const daoFactory = "0x0B6769F500b293e3adacD97c3961189565069902"
const lidoFactory = "0x1dD91b354Ebd706aB3Ac7c727455C7BAA164945A"
const lidoApp = "0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F"
const nonceCreateDaoFactory = 5
const contractNonceCreateDao = 10
const contractNonceCreateLido = 6

const deployed = [
  '0x0B6769F500b293e3adacD97c3961189565069902',
  '0xE978D4A752FEB8d27E0412d5A675EA9faE059712',
  '0x11Ea5A63f831752E23BB7c4392f7A3e31c51ed7E',
  '0xe1970358e9E5b5aA126e36532f3703CfeF0A5D01',
  '0xB5912c4C66B677b03C6c6946dE7030F143e68Bc6',
  '0x320469b6E551240b0cE1bCD4Ae6f75a7a1366073',
  '0x82F68cB03BCeB973153f97128A9D9af4a304Ef9F',
  '0xE9c991d2c9Ac29b041C8D05484C2104bD00CFF4b',
  '0x5d167E754E054F698D481d4D46fb03918f913b81',
  '0xE2Bb0843167da9672534cc939c59D6F6F31d3D42',
  '0x6B30A560dA28B7B8e9be4515F81096338942B3f9',
  '0x1dD91b354Ebd706aB3Ac7c727455C7BAA164945A',
  '0xb3CF58412a00282934D3C3E73F49347567516E98',
  '0xeC32ADA2a1E46Ff3F6206F47a6A2060200f24fDf',
  '0x4333218072D5d7008546737786663c38B4D561A4',
  '0x75c7b1D23f1cad7Fb4D60281d7069E46440BC179',
  '0xDfe76d11b365f5e0023343A367f0b311701B3bc1',
  '0xbc0B67b4553f4CF52a913DE9A6eD0057E2E758Db',
  '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
]

async function main() {

  // ***just for testing purposes***
  // resetting fork state
  await network.provider.request({
    method: "hardhat_reset",
    params: [{
      forking: {
        jsonRpcUrl: config.networks.hardhat.forking.url,
      }
    }]
  })

  // ***just for testing purposes***
  // impersonating testnet deployer acc
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [ownerAddress]
  })

  // init
  const [deployer] = await ethers.getSigners();
  const owner = await ethers.provider.getSigner(ownerAddress)

  // ***just for testing purposes***
  // top up balance
  let tx = await deployer.sendTransaction({
    to: ownerAddress,
    value: ethers.utils.parseEther('5')
  })

  // ***
  // *** start claiming ***
  // ***
  const balanceBefore = await owner.getBalance()
  console.log('[!]balance before', ethers.utils.formatEther(balanceBefore))


  //fast forward with empty txs to increase account nonce
  let n = await owner.getTransactionCount()
  while (n < nonceCreateDaoFactory) {
    console.log(`Send tx for nonce ${n}`)
    tx = await owner.sendTransaction({
      to: ownerAddress,
      value: 0
    })
    n++
  }
  n = await owner.getTransactionCount()
  console.log(`[!]nonce: ${n}`)
  if (n !== nonceCreateDaoFactory) {
    throw (new Error("Nonce not reached"))
  }

  //deploying first factory
  const Factory = await ethers.getContractFactory("Factory", owner);
  let f = await Factory.deploy(ownerAddress, deployer.address);
  await f.deployed()

  console.log(`[!]new factory: ${f.address}`)
  if (f.address !== daoFactory) {
    throw (new Error("wrong DAO factory"))
  }

  // switch to temp account to avoid change nonce on owner acc
  f = await ethers.getContractAt("Factory", daoFactory, deployer);

  let i = 0
  let r
  // skip to specified nonce 
  while (i < contractNonceCreateDao) {
    tx = await f.claimer()
    r = await tx.wait()
    console.log('new claimer', i, r.events[0].args[0])
    i++
  }

  // deploying second factory
  tx = await f.subfactory()
  r = await tx.wait()
  console.log('[!]new subfactory', r.events[0].args[0])

  if (r.events[0].args[0] !== lidoFactory) {
    throw (new Error("wrong Lido factory"))
  }

  // get subfactory
  f = await ethers.getContractAt("SubFactory", lidoFactory, deployer);
  i = 0
  // skip to specified nonce 
  while (i < contractNonceCreateLido) {
    tx = await f.claimer()
    r = await tx.wait()
    console.log('new claimer', i, r.events[0].args[0])
    i++
  }

  //deploying claimer
  tx = await f.claimer()
  r = await tx.wait()
  console.log('[!]new claimer', r.events[0].args[0])

  if (r.events[0].args[0] !== lidoApp) {
    throw (new Error("wrong Lido app"))
  }

  const balanceOnContract = await ethers.provider.getBalance(lidoApp)
  console.log('[!]balance on contract', ethers.utils.formatEther(balanceOnContract))


  // claim
  let c = await ethers.getContractAt("Claimer", lidoApp, deployer);
  tx = await c.claim(ownerAddress)

  // cleanup (optional)
  for (let addr of deployed) {
    console.log('destroying', addr)
    c = await ethers.getContractAt("Claimer", addr, deployer);
    tx = await c.die()
  }

  console.log('[!]balance before', ethers.utils.formatEther(balanceBefore))
  const balanceAfter = await owner.getBalance()
  console.log('[!]balance after', ethers.utils.formatEther(balanceAfter))
  console.log('[!]profit', ethers.utils.formatEther(balanceAfter.sub(balanceBefore).sub(balanceOnContract)))

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
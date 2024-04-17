// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  // const Hello = await hre.ethers.getContractFactory("Hello");
  // const hello = await Hello.deploy();
  // await hello.deployed();
  // console.log( ` deployed to ${hello.address}` );

  const lock = await hre.ethers.deployContract('MedicineManager');
  await lock.waitForDeployment();
  console.log(`CONTRACT deployed to ${lock.target}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
npx hardhat run ./scripts/deploy.js --network localganache
npm run start
*/
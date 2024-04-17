require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.1",
  networks: {
    localganache: {
      url: process.env.PROVIDER_URL,
      gasPrice: 8000000000,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
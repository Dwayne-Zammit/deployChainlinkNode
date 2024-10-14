require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19", // Adjust the Solidity version as needed
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_KEY, // Alchemy API URL from the .env file
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Private key from the .env file
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Etherscan API key (optional for contract verification)
  },
};

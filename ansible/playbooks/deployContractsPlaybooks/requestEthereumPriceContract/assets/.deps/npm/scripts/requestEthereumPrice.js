const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Using account:", deployer.address);

  // Address of the deployed ATestnetConsumer contract
  const consumerAddress = "0xd424F49b39e49ac8A66A7c66D5E1e770A50A44c9"; // Replace with your contract address

  // Create an instance of the ATestnetConsumer contract
  const ATestnetConsumer = await ethers.getContractFactory("ATestnetConsumer");
  const consumer = await ATestnetConsumer.attach(consumerAddress);

  // Define the oracle address and job ID
  const oracle = process.env.ORACLE_CONTRACT_ADDRESS;
  const jobId = process.env.CHAINLINK_JOB_ID;

  // Call the requestEthereumPrice function
  const tx = await consumer.requestEthereumPrice(oracle, jobId);

  console.log("Transaction sent. Waiting for confirmation...");

  // Wait for the transaction to be confirmed
  await tx.wait();

  console.log("Transaction confirmed:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

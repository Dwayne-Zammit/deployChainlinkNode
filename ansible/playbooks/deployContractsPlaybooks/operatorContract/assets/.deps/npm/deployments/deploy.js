require("dotenv").config();
const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  // Get the deployer's wallet
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Define the constructor arguments
  const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // LINK token address
  const ownerAddress = deployer.address; // Owner address

  // Compile and deploy the contract
  const ContractFactory = await ethers.getContractFactory("Operator"); // Ensure this matches your contract name
  const contract = await ContractFactory.deploy(linkAddress, ownerAddress);

  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  // Store the contract address in the .env file
  const envFilePath = ".env";
  const newEnvVariable = `OPERATOR_CONTRACT_ADDRESS=${contract.address}\n`;

  // Read existing .env file
  fs.readFile(envFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading .env file:", err);
      return;
    }

    // Check if the variable already exists
    if (data.includes("OPERATOR_CONTRACT_ADDRESS=")) {
      // Replace the existing variable
      const newData = data.replace(
        /OPERATOR_CONTRACT_ADDRESS=.*/g,
        newEnvVariable
      );
      fs.writeFile(envFilePath, newData, (err) => {
        if (err) {
          console.error("Error writing to .env file:", err);
        } else {
          console.log("Updated OPERATOR_CONTRACT_ADDRESS in .env file");
        }
      });
    } else {
      // Append the new variable
      fs.appendFile(envFilePath, newEnvVariable, (err) => {
        if (err) {
          console.error("Error appending to .env file:", err);
        } else {
          console.log("Added OPERATOR_CONTRACT_ADDRESS to .env file");
        }
      });
    }
  });

  // Now proceed to whitelist the node in the same script
  const nodeAddress = process.env.CHAINLINK_NODE_ADDRESS; // Fetching from environment variables

  // Define the Operator contract's ABI for the functions you want to call
  const operatorAbi = [
    "function setAuthorizedSenders(address[] memory senders) external",
    "function isAuthorizedSender(address sender) public view returns (bool)",
  ];

  // Create a contract instance to interact with the deployed Operator contract
  const operatorContract = new ethers.Contract(
    contract.address,
    operatorAbi,
    deployer
  );

  // Prepare the array of addresses to whitelist (it must be an array)
  const nodeAddresses = [nodeAddress];
  console.log("Attempting to whitelist node:", nodeAddress);

  // Call the setAuthorizedSenders function to whitelist the node
  const tx = await operatorContract.setAuthorizedSenders(nodeAddresses);
  console.log("Transaction sent, waiting for confirmation...", tx.hash);

  // Wait for the transaction to be confirmed on the blockchain
  const receipt = await tx.wait();
  console.log("Transaction confirmed! Hash:", receipt.transactionHash);

  // Verify if the node address is whitelisted using isAuthorizedSender
  const isWhitelisted = await operatorContract.isAuthorizedSender(nodeAddress);
  console.log(`Is node ${nodeAddress} whitelisted?`, isWhitelisted);
}

// Execute the deployment script and whitelist process
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

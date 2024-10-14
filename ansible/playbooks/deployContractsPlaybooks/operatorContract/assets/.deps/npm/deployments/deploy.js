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

  // Get current gas price (you could adjust this to be lower)
  const gasPrice = await ethers.provider.getGasPrice();
  const lowerGasPrice = gasPrice.mul(90).div(100); // Set to 90% of current gas price

  // Compile and deploy the contract with custom gas settings
  const ContractFactory = await ethers.getContractFactory("Operator"); // Ensure this matches your contract name
  const contract = await ContractFactory.deploy(linkAddress, ownerAddress, {
    gasPrice: lowerGasPrice, // Set gas price
    gasLimit: 3000000, // Set a reasonable gas limit (adjust if necessary)
  });

  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  // Create a script to export the operator contract address
  const exportScriptPath = "/tmp/set_operator_contract.sh";
  const exportScriptContent = `#!/bin/bash
export OPERATOR_CONTRACT_ADDRESS=${contract.address}
echo "OPERATOR_CONTRACT_ADDRESS set to ${contract.address}"
`;

  fs.writeFileSync(exportScriptPath, exportScriptContent, { mode: 0o775 });
  console.log(
    `Created script to set OPERATOR_CONTRACT_ADDRESS: ${exportScriptPath}`
  );

  // Inform the user how to source the script
  console.log(
    `Run the following command to set the variable in the current shell session:`
  );
  console.log(`source ${exportScriptPath}`);

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

  // Call the setAuthorizedSenders function to whitelist the node with custom gas settings
  const tx = await operatorContract.setAuthorizedSenders(nodeAddresses, {
    gasPrice: lowerGasPrice, // Set gas price
    gasLimit: 1000000, // Set a reasonable gas limit
  });
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

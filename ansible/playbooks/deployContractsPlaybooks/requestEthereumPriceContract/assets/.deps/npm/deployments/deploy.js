async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Compile and deploy the contract without passing any constructor arguments
  const ATestnetConsumer = await ethers.getContractFactory("ATestnetConsumer");

  // Set custom gas limit and gas price
  const gasLimit = 3000000; // Set a custom gas limit (adjust as needed)
  const gasPrice = ethers.utils.parseUnits("10", "gwei"); // Set a custom gas price (adjust as needed)

  // Deploy the contract with custom gas parameters
  const consumer = await ATestnetConsumer.deploy({
    gasLimit: gasLimit,
    gasPrice: gasPrice,
  });

  console.log("ATestnetConsumer deployed to:", consumer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

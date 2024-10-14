const { ethers } = require('hardhat');

async function main() {
    // Get the deployer's wallet
    const [deployer] = await ethers.getSigners();

    console.log("Sending LINK from account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Define the LINK token contract address on Sepolia
    const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

    // Define the recipient address and amount to send
    const recipientAddress = "0xe0c3BBf39c4826FaB7B1d4796c0ED318afD7ca01"; // Replace with the recipient's address
    // const recipientAddress = "0xaebc9ec1ec38661bfA71dC2BDf23cC25F1e58D74"; // Replace with the recipient's address
    const amountToSend = ethers.utils.parseUnits("1.0", 18); // 1 LINK token (LINK has 18 decimals)

    // Define the ABI including balanceOf and transfer functions
    const linkAbi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function transfer(address to, uint amount) external returns (bool)"
    ];

    // Create a contract instance
    const linkContract = new ethers.Contract(linkAddress, linkAbi, deployer);

    // Check the balance before sending
    const balanceBefore = await linkContract.balanceOf(deployer.address);
    console.log("Balance before sending:", ethers.utils.formatUnits(balanceBefore, 18));

    // Send LINK tokens
    const tx = await linkContract.transfer(recipientAddress, amountToSend);
    await tx.wait();

    // Check the balance after sending
    const balanceAfter = await linkContract.balanceOf(deployer.address);
    console.log("Balance after sending:", ethers.utils.formatUnits(balanceAfter, 18));

    console.log(`Sent 1 LINK to ${recipientAddress}`);
}

// Execute the send LINK script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

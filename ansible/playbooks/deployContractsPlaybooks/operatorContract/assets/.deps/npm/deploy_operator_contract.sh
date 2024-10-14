#!/bin/bash

# Load NVM (if you're using it)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Navigate to the project directory
cd /tmp/ChainlinkContractsAssets/ansible/playbooks/deployContractsPlaybooks/operatorContract/assets/.deps/npm || { echo "Directory not found!"; exit 1; }

# Verify Node.js version
echo "Node.js version before installation: $(node --version)"

# Install Hardhat
echo "Installing Hardhat..."
npm install --save-dev hardhat || { echo "Failed to install Hardhat!"; exit 1; }

# Install dotenv
echo "Installing dotenv..."
npm install dotenv --save || { echo "Failed to install dotenv!"; exit 1; }

# Install Hardhat Ethers
echo "Installing Hardhat Ethers..."
npm install --save-dev @nomiclabs/hardhat-ethers "ethers@^5.0.0" || { echo "Failed to install Hardhat Ethers!"; exit 1; }

# Install Chainlink contracts
echo "Installing Chainlink contracts..."
npm install @chainlink/contracts || { echo "Failed to install Chainlink contracts!"; exit 1; }

# Deploy the contract
echo "Deploying the Operator contract..."
npx hardhat run deployments/deploy.js --network sepolia || { echo "Deployment failed!"; exit 1; }

echo "Deployment complete."


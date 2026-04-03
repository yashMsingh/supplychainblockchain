"use strict";

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

function updateFrontendConfig(address) {
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "SupplyChain.sol", "SupplyChain.json");
  const frontendConfigPath = path.join(__dirname, "..", "frontend", "src", "contractConfig.js");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const fileContents = `export const CONTRACT_ADDRESS = "${address}";

export const CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};
`;

  fs.writeFileSync(frontendConfigPath, fileContents);
  console.log("Frontend contract config updated:", frontendConfigPath);
}

async function main() {
  // Get deployer account from configured signers.
  const [deployer] = await ethers.getSigners();

  // Log deployer address for traceability.
  console.log("Deploying SupplyChain contract...");
  console.log("Deployer address:", deployer.address);

  // Load SupplyChain contract factory.
  const SupplyChain = await ethers.getContractFactory("SupplyChain");

  // Deploy contract instance to current network.
  const supplyChain = await SupplyChain.deploy();

  // Wait until deployment is fully mined.
  await supplyChain.waitForDeployment();

  // Resolve deployed address and print final status.
  const address = await supplyChain.getAddress();
  console.log("SupplyChain deployed successfully!");
  console.log("Contract address:", address);

  updateFrontendConfig(address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

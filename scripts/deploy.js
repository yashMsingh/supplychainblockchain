"use strict";

const { ethers } = require("hardhat");

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
import { ethers } from "hardhat";

async function main() {
  const sig = await ethers.getSigners();

  const cnt = await ethers.deployContract("Subscription", [sig[0].address]);

  await cnt.waitForDeployment();

  console.log(`Subscription contract deployed to ${cnt.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

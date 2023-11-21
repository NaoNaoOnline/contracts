import { ethers } from "hardhat";

async function main() {
  const cnt = await ethers.deployContract("Policy", [0]);

  await cnt.waitForDeployment();

  console.log(`Policy contract deployed to ${cnt.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers } from "hardhat";

async function main() {
  const cnt = await ethers.deployContract("Subscription", ["0x6591C0Ee99D48b43a2c84Da284DB7A526C2dAfE0"]);

  await cnt.waitForDeployment();

  console.log(`Subscription contract deployed to ${cnt.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

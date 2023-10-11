import { ethers } from "hardhat";

async function main() {
  const sig = await ethers.getSigners();

  for (const y of sig) {
    console.log(y.address);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

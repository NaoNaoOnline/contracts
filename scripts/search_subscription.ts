import { ethers } from "hardhat";

async function main() {
  const sig = await ethers.getSigners();

  const uid: number = 1702591861053207;

  const scn = await ethers.getContractAt("Subscription", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

  const uni = await scn.getSubUni(uid);

  console.log(`Found unix timestamp ${uni} which is ${new Date(Number(uni)).toISOString()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

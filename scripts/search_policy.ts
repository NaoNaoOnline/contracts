import { ethers } from "hardhat";

async function main() {
  const sig = await ethers.getSigners();

  const pcn = await ethers.getContractAt("Policy", "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512");

  const fir = await pcn.searchBlocks();

  console.log(`Blocks before iteration ${fir}`);
  console.log("");

  const [cur, rec] = await pcn.searchRecord(0, fir);

  for (const x of rec) {
    console.log("  ", Number(x.sys), x.mem, Number(x.acc));
  }

  const sec = await pcn.searchBlocks();

  console.log("");
  console.log(`Blocks after iteration ${sec}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

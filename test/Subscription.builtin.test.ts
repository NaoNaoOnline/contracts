import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.setSubAmn", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("fallback", () => {
    it("should revert", async () => {
      const { sig, scn } = await loadFixture(deployContract);
      const tnx = sig[1].sendTransaction({ to: await scn.getAddress(), data: "0x1234" });
      await expect(tnx).to.be.revertedWith("fallback() not implemented");
    });
  });

  describe("receive", () => {
    it("should revert", async () => {
      const { sig, scn } = await loadFixture(deployContract);
      const tnx = sig[1].sendTransaction({ to: await scn.getAddress(), value: ethers.parseUnits("0.003", "ether") });
      await expect(tnx).to.be.revertedWith("receive() not implemented");
    });
  });
});

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.setFeeAmn", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("setFeeAmn", () => {
    describe("signer one (deployer)", () => {
      it("should not be able to change the fee amount", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[0]).setFeeAmn(5000)
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });

    describe("signer two", () => {
      const setFeeAmn50P = async () => {
        const { sig, scn } = await loadFixture(deployContract);

        await scn.connect(sig[1]).setFeeAmn(5000)

        return { sig, scn };
      }

      it("should be able to change the fee amount", async () => {
        const { sig, scn } = await loadFixture(setFeeAmn50P);
        expect((await scn.getFeeAmn())).to.equal(5000);
      });
    });

    describe("signer three", () => {
      it("should not be able to change the fee amount", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[2]).setFeeAmn(5000)
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });
  });
});

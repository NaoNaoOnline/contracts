import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.setFeeAdd", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("setFeeAdd", () => {
    describe("signer one (deployer)", () => {
      it("should not be able to change the fee address", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[0]).setFeeAdd(sig[0])
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });

    describe("signer two", () => {
      const setFeeAddFou = async () => {
        const { sig, scn } = await loadFixture(deployContract);

        await scn.connect(sig[1]).setFeeAdd(sig[3])

        return { sig, scn };
      }

      it("should be able to change the fee address", async () => {
        const { sig, scn } = await loadFixture(setFeeAddFou);
        expect((await scn.getFeeAdd())).to.equal(sig[3].address);
      });
    });

    describe("signer three", () => {
      it("should not be able to change the fee address", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[2]).setFeeAdd(sig[2])
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });
  });
});

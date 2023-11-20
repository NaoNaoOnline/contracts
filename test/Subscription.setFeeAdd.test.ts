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
      it("should not be able to change the fee address to themselves", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[0]).setFeeAdd(sig[0])
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });

    describe("signer two", () => {
      const setFeeAddFiv = async () => {
        const { sig, scn } = await loadFixture(deployContract);

        await scn.connect(sig[1]).setFeeAdd(sig[4])

        return { sig, scn };
      }

      it("should be able to change the fee address to somebody else", async () => {
        const { sig, scn } = await loadFixture(setFeeAddFiv);
        expect((await scn.getFeeAdd())).to.equal(sig[4].address);
      });
    });

    describe("signer three", () => {
      it("should not be able to change the fee address to themselves", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[2]).setFeeAdd(sig[2])
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });

    describe("signer four", () => {
      it("should not be able to change the fee address to somebody else", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[3]).setFeeAdd(sig[4])
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });
  });
});
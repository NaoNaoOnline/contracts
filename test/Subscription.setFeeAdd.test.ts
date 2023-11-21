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
      describe("zero address", () => {
        it("should not be able to change the fee address to zero address", async () => {
          const { sig, scn } = await loadFixture(deployContract);
          const tnx = scn.connect(sig[1]).setFeeAdd(ethers.ZeroAddress)
          await expect(tnx).to.be.revertedWith("fee address must not be zero");
        });
      });

      describe("valid address", () => {
        const setFeeAddFiv = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          const tnx = scn.connect(sig[1]).setFeeAdd(sig[4])
          await tnx;

          return { sig, scn, tnx };
        }

        it("should be able to change the fee address to somebody else", async () => {
          const { sig, scn } = await loadFixture(setFeeAddFiv);
          expect((await scn.getFeeAdd())).to.equal(sig[4].address);
        });

        it("should emit event SetFeeAdd", async () => {
          const { sig, scn, tnx } = await loadFixture(setFeeAddFiv);
          await expect(tnx).to.emit(scn, "SetFeeAdd").withArgs(sig[4].address);
        });
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

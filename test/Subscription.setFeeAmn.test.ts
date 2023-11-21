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
      describe("below 1%", () => {
        it("should not be able to change the fee amount to below 1%", async () => {
          const { sig, scn } = await loadFixture(deployContract);
          const tnx = scn.connect(sig[1]).setFeeAmn(99)
          await expect(tnx).to.be.revertedWith("fee amount must be >= 1%");
        });
      });

      describe("exactly 1%", () => {
        const setFeeAmn01P = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          const tnx = scn.connect(sig[1]).setFeeAmn(100)
          await tnx;

          return { sig, scn, tnx };
        }

        it("should be able to change the fee amount to exactly 1%", async () => {
          const { scn } = await loadFixture(setFeeAmn01P);
          expect((await scn.getFeeAmn())).to.equal(100);
        });

        it("should emit event SetFeeAmn", async () => {
          const { scn, tnx } = await loadFixture(setFeeAmn01P);
          await expect(tnx).to.emit(scn, "SetFeeAmn").withArgs(100);
        });
      });

      describe("exactly 50%", () => {
        const setFeeAmn50P = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          const tnx = scn.connect(sig[1]).setFeeAmn(5000)
          await tnx;

          return { sig, scn, tnx };
        }

        it("should be able to change the fee amount to exactly 50%", async () => {
          const { scn } = await loadFixture(setFeeAmn50P);
          expect((await scn.getFeeAmn())).to.equal(5000);
        });

        it("should emit event SetFeeAmn", async () => {
          const { scn, tnx } = await loadFixture(setFeeAmn50P);
          await expect(tnx).to.emit(scn, "SetFeeAmn").withArgs(5000);
        });
      });

      describe("above 50%", () => {
        it("should not be able to change the fee amount to above 50%", async () => {
          const { sig, scn } = await loadFixture(deployContract);
          const tnx = scn.connect(sig[1]).setFeeAmn(5001)
          await expect(tnx).to.be.revertedWith("fee amount must be <= 50%");
        });
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

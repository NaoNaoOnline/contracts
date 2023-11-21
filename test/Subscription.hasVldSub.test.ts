import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.hasVldSub", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("hasVldSub", () => {
    const subOne = async () => {
      const { sig, scn } = await loadFixture(deployContract);

      await scn.connect(sig[2]).subOne(sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

      return { sig, scn };
    }

    describe("signer one (deployer)", () => {
      it("should not have valid subscription", async () => {
        const { sig, scn } = await loadFixture(subOne);
        expect((await scn.hasVldSub(sig[0], 1698793200))).to.equal(false);
      });
    });

    describe("signer two", () => {
      it("should not have valid subscription", async () => {
        const { sig, scn } = await loadFixture(subOne);
        expect((await scn.hasVldSub(sig[1], 1698793200))).to.equal(false);
      });
    });

    describe("signer three", () => {
      describe("with incorrect unix timestamp", () => {
        describe("zero", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOne);
            expect((await scn.hasVldSub(sig[2], 0))).to.equal(false);
          });
        });

        describe("below", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOne);
            expect((await scn.hasVldSub(sig[2], 1698793199))).to.equal(false);
          });
        });

        describe("above", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOne);
            expect((await scn.hasVldSub(sig[2], 1698793201))).to.equal(false);
          });
        });
      });

      describe("with correct unix timestamp", () => {
        it("should have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOne);
          expect((await scn.hasVldSub(sig[2], 1698793200))).to.equal(true);
        });
      });
    });

    describe("signer four", () => {
      it("should not have valid subscription", async () => {
        const { sig, scn } = await loadFixture(subOne);
        expect((await scn.hasVldSub(sig[3], 1698793200))).to.equal(false);
      });
    });
  });
});

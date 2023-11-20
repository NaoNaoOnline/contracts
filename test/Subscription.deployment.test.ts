import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.deployment", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("deployment", () => {
    describe("_feeadd", () => {
      it("should default to signer two", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        expect((await scn.getFeeAdd())).to.equal(sig[1].address);
      });
    });

    describe("_feeamn", () => {
      it("should default to 1000 basis points", async () => {
        const { scn } = await loadFixture(deployContract);
        expect((await scn.getFeeAmn())).to.equal(1000);
      });
    });

    describe("_subamn", () => {
      it("should default to 3000000000000000 wei", async () => {
        const { scn } = await loadFixture(deployContract);
        expect((await scn.getSubAmn())).to.equal(3000000000000000);
      });
    });
  });
});

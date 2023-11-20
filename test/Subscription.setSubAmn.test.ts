import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.setSubAmn", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("setSubAmn", () => {
    describe("signer one (deployer)", () => {
      it("should not be able to change the subscription amount", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[0]).setSubAmn(BigInt("500000000000000000"))
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });

    describe("signer two", () => {
      describe("exactly 0%", () => {
        it("should not be able to change the subscription amount to exactly 0%", async () => {
          const { sig, scn } = await loadFixture(deployContract);
          const tnx = scn.connect(sig[1]).setSubAmn(0)
          await expect(tnx).to.be.revertedWith("subscription amount must not be zero");
        });
      });

      describe("exactly 0.5 ETH", () => {
        const setSubAmn05E = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[1]).setSubAmn(BigInt("500000000000000000"))

          return { sig, scn };
        }

        it("should be able to change the subscription amount to exactly 0.5 ETH", async () => {
          const { scn } = await loadFixture(setSubAmn05E);
          expect((await scn.getSubAmn())).to.equal(BigInt("500000000000000000"));
        });
      });
    });

    describe("signer three", () => {
      it("should not be able to change the subscription amount", async () => {
        const { sig, scn } = await loadFixture(deployContract);
        const tnx = scn.connect(sig[2]).setSubAmn(BigInt("500000000000000000"))
        await expect(tnx).to.be.revertedWithCustomError(scn, "OwnableUnauthorizedAccount");
      });
    });
  });
});

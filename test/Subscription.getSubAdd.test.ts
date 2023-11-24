import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.getSubAdd", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("getSubAdd", () => {
    describe("single subscription", () => {
      const subOneSin = async () => {
        const { sig, scn } = await loadFixture(deployContract);

        await scn.connect(sig[2]).subOne(sig[2], sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

        return { sig, scn };
      }

      describe("signer one (deployer)", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[0]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });

      describe("signer two", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[1]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });

      describe("signer three", () => {
        it("should have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[2]))).to.deep.equal([sig[3].address, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });

      describe("signer four", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[3]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });
    });

    describe("multiple subscriptions", () => {
      const subOneSin = async () => {
        const { sig, scn } = await loadFixture(deployContract);

        await scn.connect(sig[2]).subOne(sig[2], sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
        await scn.connect(sig[2]).subTwo(sig[2], sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

        return { sig, scn };
      }

      describe("signer one (deployer)", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[0]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });

      describe("signer two", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[1]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });

      describe("signer three", () => {
        it("should have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[2]))).to.deep.equal([sig[3].address, sig[6].address, ethers.ZeroAddress]);
        });
      });

      describe("signer four", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[3]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });
    });

    describe("multiple subscriptions", () => {
      const subOneSin = async () => {
        const { sig, scn } = await loadFixture(deployContract);

        await scn.connect(sig[2]).subOne(sig[2], sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
        await scn.connect(sig[2]).subTwo(sig[2], sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })
        await scn.connect(sig[2]).subThr(sig[2], sig[3], 20, sig[6], 50, sig[9], 30, 1704063600, { value: ethers.parseUnits("0.003", "ether") })

        return { sig, scn };
      }

      describe("signer one (deployer)", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[0]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });

      describe("signer two", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[1]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });

      describe("signer three", () => {
        it("should have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[2]))).to.deep.equal([sig[3].address, sig[6].address, sig[9].address]);
        });
      });

      describe("signer four", () => {
        it("should not have valid subscription", async () => {
          const { sig, scn } = await loadFixture(subOneSin);
          expect((await scn.getSubAdd(sig[3]))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
        });
      });
    });
  });
});

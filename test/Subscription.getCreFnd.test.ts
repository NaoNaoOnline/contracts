import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.getCreFnd", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("getCreFnd", () => {
    describe("single subscription", () => {
      describe("for yourself", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[3]).subOne(2, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getCreFnd(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getCreFnd(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getCreFnd(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should have valid subscription count of 1", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getCreFnd(sig[3]))).to.equal(1);
          });
        });
      });

      describe("for somebody else", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(1, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getCreFnd(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getCreFnd(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getCreFnd(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should have valid subscription count of 1", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getCreFnd(sig[3]))).to.equal(1);
          });
        });
      });
    });

    describe("multiple subscriptions", () => {
      describe("for yourself", () => {
        const subTwoMul = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[3]).subOne(2, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[3]).subTwo(2, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should have valid subscription count of 2", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[3]))).to.equal(2);
          });
        });

        describe("signer seven", () => {
          it("should have valid subscription count of 1", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[6]))).to.equal(1);
          });
        });
      });

      describe("for somebody else", () => {
        const subTwoMul = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(1, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(1, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should have valid subscription count of 2", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[3]))).to.equal(2);
          });
        });

        describe("signer seven", () => {
          it("should have valid subscription count of 1", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getCreFnd(sig[6]))).to.equal(1);
          });
        });
      });
    });

    describe("multiple subscriptions", () => {
      describe("for yourself", () => {
        const subThrMul = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[3]).subOne(2, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[3]).subTwo(2, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[3]).subThr(2, sig[3], 20, sig[6], 50, sig[9], 30, 1704063600, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should have valid subscription count of 3", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[3]))).to.equal(3);
          });
        });

        describe("signer seven", () => {
          it("should have valid subscription count of 2", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[6]))).to.equal(2);
          });
        });

        describe("signer ten", () => {
          it("should have valid subscription count of 1", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[9]))).to.equal(1);
          });
        });
      });

      describe("for somebody else", () => {
        const subThrMul = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(1, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(1, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subThr(1, sig[3], 20, sig[6], 50, sig[9], 30, 1704063600, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription count", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should have valid subscription count of 3", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[3]))).to.equal(3);
          });
        });

        describe("signer seven", () => {
          it("should have valid subscription count of 2", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[6]))).to.equal(2);
          });
        });

        describe("signer ten", () => {
          it("should have valid subscription count of 1", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getCreFnd(sig[9]))).to.equal(1);
          });
        });
      });
    });
  });
});

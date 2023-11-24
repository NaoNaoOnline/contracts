import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.getSubUnx", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("getSubUnx", () => {
    describe("single subscription", () => {
      describe("for yourself", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(sig[2], sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[2]))).to.equal(1698793200);
          });
        });

        describe("signer four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[3]))).to.equal(0);
          });
        });
      });

      describe("for somebody else", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(sig[1], sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[1]))).to.equal(1698793200);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[3]))).to.equal(0);
          });
        });
      });
    });

    describe("multiple subscriptions", () => {
      describe("for yourself", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(sig[2], sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(sig[2], sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[2]))).to.equal(1701385200);
          });
        });

        describe("signer four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[3]))).to.equal(0);
          });
        });
      });

      describe("for somebody else", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(sig[1], sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(sig[1], sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[1]))).to.equal(1701385200);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[3]))).to.equal(0);
          });
        });
      });
    });

    describe("multiple subscriptions", () => {
      describe("for yourself", () => {
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
            expect((await scn.getSubUnx(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[1]))).to.equal(0);
          });
        });

        describe("signer three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[2]))).to.equal(1704063600);
          });
        });

        describe("signer four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[3]))).to.equal(0);
          });
        });
      });

      describe("for somebody else", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(sig[1], sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(sig[1], sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subThr(sig[1], sig[3], 20, sig[6], 50, sig[9], 30, 1704063600, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("signer one (deployer)", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[0]))).to.equal(0);
          });
        });

        describe("signer two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[1]))).to.equal(1704063600);
          });
        });

        describe("signer three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[2]))).to.equal(0);
          });
        });

        describe("signer four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUnx(sig[3]))).to.equal(0);
          });
        });
      });
    });
  });
});

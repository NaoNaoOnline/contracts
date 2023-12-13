import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.getSubCre", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("getSubCre", () => {
    describe("single subscription", () => {
      describe("for yourself", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(2, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubCre(0))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubCre(1))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubCre(2))).to.deep.equal([sig[3].address, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubCre(3))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });
      });

      describe("for somebody else", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(1, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubCre(0))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubCre(1))).to.deep.equal([sig[3].address, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubCre(2))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubCre(3))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });
      });
    });

    describe("multiple subscriptions", () => {
      describe("for yourself", () => {
        const subTwoMul = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(2, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(2, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getSubCre(0))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getSubCre(1))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getSubCre(2))).to.deep.equal([sig[3].address, sig[6].address, ethers.ZeroAddress]);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getSubCre(3))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
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

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getSubCre(0))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getSubCre(1))).to.deep.equal([sig[3].address, sig[6].address, ethers.ZeroAddress]);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getSubCre(2))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subTwoMul);
            expect((await scn.getSubCre(3))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });
      });
    });

    describe("multiple subscriptions", () => {
      describe("for yourself", () => {
        const subThrMul = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(2, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(2, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subThr(2, sig[3], 20, sig[6], 50, sig[9], 30, 1704063600, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getSubCre(0))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getSubCre(1))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getSubCre(2))).to.deep.equal([sig[3].address, sig[6].address, sig[9].address]);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getSubCre(3))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
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

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getSubCre(0))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getSubCre(1))).to.deep.equal([sig[3].address, sig[6].address, sig[9].address]);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getSubCre(2))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subThrMul);
            expect((await scn.getSubCre(3))).to.deep.equal([ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress]);
          });
        });
      });
    });
  });
});

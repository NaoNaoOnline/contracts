import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.getSubUni", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("getSubUni", () => {
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
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(1))).to.equal(0);
          });
        });

        describe("user ID three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(2))).to.equal(1698793200);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
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
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(1))).to.equal(1698793200);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(2))).to.equal(0);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
          });
        });
      });

      describe("big int", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(BigInt("1702388623965082295"), sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(BigInt("1702388623965082295")))).to.equal(1698793200);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(2))).to.equal(0);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
          });
        });
      });
    });

    describe("multiple subscriptions", () => {
      describe("for yourself", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(2, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(2, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(1))).to.equal(0);
          });
        });

        describe("user ID three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(2))).to.equal(1701385200);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
          });
        });
      });

      describe("for somebody else", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(1, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(1, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(1))).to.equal(1701385200);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(2))).to.equal(0);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
          });
        });
      });

      describe("big int", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(BigInt("1702388623"), sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(BigInt("1702388623965082295"), sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(BigInt("1702388623")))).to.equal(1698793200);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(BigInt("1702388623965082295")))).to.equal(1701385200);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
          });
        });
      });
    });

    describe("multiple subscriptions", () => {
      describe("for yourself", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(2, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(2, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subThr(2, sig[3], 20, sig[6], 50, sig[9], 30, 1704063600, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(1))).to.equal(0);
          });
        });

        describe("user ID three", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(2))).to.equal(1704063600);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
          });
        });
      });

      describe("for somebody else", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(1, sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(1, sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subThr(1, sig[3], 20, sig[6], 50, sig[9], 30, 1704063600, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(1))).to.equal(1704063600);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(2))).to.equal(0);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
          });
        });
      });

      describe("big int", () => {
        const subOneSin = async () => {
          const { sig, scn } = await loadFixture(deployContract);

          await scn.connect(sig[2]).subOne(BigInt("1702388623965082295"), sig[3], 1698793200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subTwo(BigInt("1702388623965082295"), sig[3], 50, sig[6], 50, 1701385200, { value: ethers.parseUnits("0.003", "ether") })
          await scn.connect(sig[2]).subThr(BigInt("1702388623965082295"), sig[3], 20, sig[6], 50, sig[9], 30, 1704063600, { value: ethers.parseUnits("0.003", "ether") })

          return { sig, scn };
        }

        describe("user ID one", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(0))).to.equal(0);
          });
        });

        describe("user ID two", () => {
          it("should have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(BigInt("1702388623965082295")))).to.equal(1704063600);
          });
        });

        describe("user ID three", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(2))).to.equal(0);
          });
        });

        describe("user ID four", () => {
          it("should not have valid subscription", async () => {
            const { sig, scn } = await loadFixture(subOneSin);
            expect((await scn.getSubUni(3))).to.equal(0);
          });
        });
      });
    });
  });
});

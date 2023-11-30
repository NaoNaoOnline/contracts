import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Subscription.subTwo", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("Subscription")).deploy(sig[1].address);

    return { sig, scn };
  }

  describe("subTwo", () => {
    describe("service fee 10%, subscription fee 0.003 ETH", () => {
      const setFeeDefSubDef = async () => {
        const { sig, scn } = await loadFixture(deployContract);

        await scn.connect(sig[1]).setFeeAmn(1000) // 10%
        await scn.connect(sig[1]).setSubAmn(ethers.parseUnits("0.003", "ether"))

        return { sig, scn };
      }

      describe("signer three fails to subscribe", () => {
        describe("invalid subscription address", () => {
          it("should not be able to subscribe with zero address", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(ethers.ZeroAddress, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("receiver user ID must not be zero");
          });
        });

        describe("invalid creator address", () => {
          it("should not be able to subscribe with zero address", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, ethers.ZeroAddress, 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("creator address must not be zero");
          });

          it("should not be able to subscribe with zero address", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, ethers.ZeroAddress, 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("creator address must not be zero");
          });
        });

        describe("invalid unix timestamp", () => {
          it("should not be able to subscribe with zero timestamp", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 0, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("unix timestamp must be current");
          });

          it("should not be able to subscribe with outdated timestamp", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 169, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("unix timestamp must be current");
          });

          it("should not be able to subscribe with earlier timestamp", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            await scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1696111200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("unix timestamp must be current");
          });

          it("should not be able to subscribe with same timestamp twice", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            await scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("unix timestamp must be current");
          });
        });

        describe("invalid subscription amount", () => {
          it("should not be able to subscribe with zero amount", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: 0 })
            await expect(tnx).to.be.revertedWith("subscription amount must match");
          });

          it("should not be able to subscribe with lesser amount", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.0027", "ether") })
            await expect(tnx).to.be.revertedWith("subscription amount must match");
          });

          it("should not be able to subscribe with greater amount", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.5", "ether") })
            await expect(tnx).to.be.revertedWith("subscription amount must match");
          });
        });

        describe("invalid creator amount", () => {
          it("should not be able to subscribe with zero amount", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 0, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must not be zero");
          });

          it("should not be able to subscribe with zero amount", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 0, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must not be zero");
          });

          it("should not be able to subscribe with non-100-sum", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 80, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must add up to 100");
          });

          it("should not be able to subscribe with non-100-sum", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 10, sig[6], 500, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must add up to 100");
          });

          it("should not be able to subscribe with non-100-sum", async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 20, sig[6], 20, 1698793200, { value: ethers.parseUnits("0.003", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must add up to 100");
          });
        });
      });

      describe("signer three subscribes successfully", () => {
        describe("75/25", () => {
          const subTwo = async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);

            const bl1 = await ethers.provider.getBalance(sig[1]);
            const bl2 = await ethers.provider.getBalance(sig[2]);
            const bl3 = await ethers.provider.getBalance(sig[3]);
            const bl6 = await ethers.provider.getBalance(sig[6]);

            await scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.003", "ether") })

            return { sig, scn, bl1, bl2, bl3, bl6 };
          }

          describe("signer two", () => {
            it("should receive service fee of exactly 0.0003 ETH", async () => {
              const { sig, bl1 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[1]))).to.equal(bl1 + ethers.parseUnits("0.0003", "ether"));
            });
          });

          describe("signer three", () => {
            it("should pay subscription fee of at least 0.003 ETH", async () => {
              const { sig, bl2 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[2]))).to.be.within(bl2 - ethers.parseUnits("0.004", "ether"), bl2 - ethers.parseUnits("0.003", "ether"));
            });
          });

          describe("signer four", () => {
            it("should receive creator payment of exactly 0.002025 ETH", async () => {
              const { sig, bl3 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[3]))).to.equal(bl3 + ethers.parseUnits("0.002025", "ether"));
            });
          });

          describe("signer seven", () => {
            it("should receive creator payment of exactly 0.000675 ETH", async () => {
              const { sig, bl6 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[6]))).to.equal(bl6 + ethers.parseUnits("0.000675", "ether"));
            });
          });
        });

        describe("50/50", () => {
          const subTwo = async () => {
            const { sig, scn } = await loadFixture(setFeeDefSubDef);

            const bl1 = await ethers.provider.getBalance(sig[1]);
            const bl2 = await ethers.provider.getBalance(sig[2]);
            const bl3 = await ethers.provider.getBalance(sig[3]);
            const bl6 = await ethers.provider.getBalance(sig[6]);

            await scn.connect(sig[2]).subTwo(2, sig[3], 50, sig[6], 50, 1698793200, { value: ethers.parseUnits("0.003", "ether") })

            return { sig, scn, bl1, bl2, bl3, bl6 };
          }

          describe("signer two", () => {
            it("should receive service fee of exactly 0.0003 ETH", async () => {
              const { sig, bl1 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[1]))).to.equal(bl1 + ethers.parseUnits("0.0003", "ether"));
            });
          });

          describe("signer three", () => {
            it("should pay subscription fee of at least 0.003 ETH", async () => {
              const { sig, bl2 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[2]))).to.be.within(bl2 - ethers.parseUnits("0.004", "ether"), bl2 - ethers.parseUnits("0.003", "ether"));
            });
          });

          describe("signer four", () => {
            it("should receive creator payment of exactly 0.00135 ETH", async () => {
              const { sig, bl3 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[3]))).to.equal(bl3 + ethers.parseUnits("0.00135", "ether"));
            });
          });

          describe("signer seven", () => {
            it("should receive creator payment of exactly 0.00135 ETH", async () => {
              const { sig, bl6 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[6]))).to.equal(bl6 + ethers.parseUnits("0.00135", "ether"));
            });
          });
        });
      });
    });

    describe("service fee 25%, subscription fee 0.025 ETH", () => {
      const setFee25PSub25F = async () => {
        const { sig, scn } = await loadFixture(deployContract);

        await scn.connect(sig[1]).setFeeAmn(2500) // 25%
        await scn.connect(sig[1]).setSubAmn(ethers.parseUnits("0.025", "ether"))

        return { sig, scn };
      }

      describe("signer three fails to subscribe", () => {
        describe("invalid subscription address", () => {
          it("should not be able to subscribe with zero address", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(ethers.ZeroAddress, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("receiver user ID must not be zero");
          });
        });

        describe("invalid creator address", () => {
          it("should not be able to subscribe with zero address", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, ethers.ZeroAddress, 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("creator address must not be zero");
          });

          it("should not be able to subscribe with zero address", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, ethers.ZeroAddress, 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("creator address must not be zero");
          });
        });

        describe("invalid unix timestamp", () => {
          it("should not be able to subscribe with zero timestamp", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 0, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("unix timestamp must be current");
          });

          it("should not be able to subscribe with outdated timestamp", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 169, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("unix timestamp must be current");
          });

          it("should not be able to subscribe with earlier timestamp", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            await scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1696111200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("unix timestamp must be current");
          });

          it("should not be able to subscribe with same timestamp twice", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            await scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("unix timestamp must be current");
          });
        });

        describe("invalid subscription amount", () => {
          it("should not be able to subscribe with zero amount", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: 0 })
            await expect(tnx).to.be.revertedWith("subscription amount must match");
          });

          it("should not be able to subscribe with lesser amount", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.0027", "ether") })
            await expect(tnx).to.be.revertedWith("subscription amount must match");
          });

          it("should not be able to subscribe with greater amount", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.5", "ether") })
            await expect(tnx).to.be.revertedWith("subscription amount must match");
          });
        });

        describe("invalid creator amount", () => {
          it("should not be able to subscribe with zero amount", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 0, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must not be zero");
          });

          it("should not be able to subscribe with zero amount", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 0, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must not be zero");
          });

          it("should not be able to subscribe with non-100-sum", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 80, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must add up to 100");
          });

          it("should not be able to subscribe with non-100-sum", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 10, sig[6], 500, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must add up to 100");
          });

          it("should not be able to subscribe with non-100-sum", async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);
            const tnx = scn.connect(sig[2]).subTwo(2, sig[3], 20, sig[6], 20, 1698793200, { value: ethers.parseUnits("0.025", "ether") })
            await expect(tnx).to.be.revertedWith("creator amount must add up to 100");
          });
        });
      });

      describe("signer three subscribes successfully", () => {
        describe("75/25", () => {
          const subTwo = async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);

            const bl1 = await ethers.provider.getBalance(sig[1]);
            const bl2 = await ethers.provider.getBalance(sig[2]);
            const bl3 = await ethers.provider.getBalance(sig[3]);
            const bl6 = await ethers.provider.getBalance(sig[6]);

            await scn.connect(sig[2]).subTwo(2, sig[3], 75, sig[6], 25, 1698793200, { value: ethers.parseUnits("0.025", "ether") })

            return { sig, scn, bl1, bl2, bl3, bl6 };
          }

          describe("signer two", () => {
            it("should receive service fee of exactly 0.00625 ETH", async () => {
              const { sig, bl1 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[1]))).to.equal(bl1 + ethers.parseUnits("0.00625", "ether"));
            });
          });

          describe("signer three", () => {
            it("should pay subscription fee of at least 0.025 ETH", async () => {
              const { sig, bl2 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[2]))).to.be.within(bl2 - ethers.parseUnits("0.035", "ether"), bl2 - ethers.parseUnits("0.025", "ether"));
            });
          });

          describe("signer four", () => {
            it("should receive creator payment of exactly 0.0140625 ETH", async () => {
              const { sig, bl3 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[3]))).to.equal(bl3 + ethers.parseUnits("0.0140625", "ether"));
            });
          });

          describe("signer seven", () => {
            it("should receive creator payment of exactly 0.0046875 ETH", async () => {
              const { sig, bl6 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[6]))).to.equal(bl6 + ethers.parseUnits("0.0046875", "ether"));
            });
          });
        });

        describe("50/50", () => {
          const subTwo = async () => {
            const { sig, scn } = await loadFixture(setFee25PSub25F);

            const bl1 = await ethers.provider.getBalance(sig[1]);
            const bl2 = await ethers.provider.getBalance(sig[2]);
            const bl3 = await ethers.provider.getBalance(sig[3]);
            const bl6 = await ethers.provider.getBalance(sig[6]);

            await scn.connect(sig[2]).subTwo(2, sig[3], 50, sig[6], 50, 1698793200, { value: ethers.parseUnits("0.025", "ether") })

            return { sig, scn, bl1, bl2, bl3, bl6 };
          }

          describe("signer two", () => {
            it("should receive service fee of exactly 0.00625 ETH", async () => {
              const { sig, bl1 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[1]))).to.equal(bl1 + ethers.parseUnits("0.00625", "ether"));
            });
          });

          describe("signer three", () => {
            it("should pay subscription fee of at least 0.025 ETH", async () => {
              const { sig, bl2 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[2]))).to.be.within(bl2 - ethers.parseUnits("0.035", "ether"), bl2 - ethers.parseUnits("0.025", "ether"));
            });
          });

          describe("signer four", () => {
            it("should receive creator payment of exactly 0.009375 ETH", async () => {
              const { sig, bl3 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[3]))).to.equal(bl3 + ethers.parseUnits("0.009375", "ether"));
            });
          });

          describe("signer seven", () => {
            it("should receive creator payment of exactly 0.009375 ETH", async () => {
              const { sig, bl6 } = await loadFixture(subTwo);
              expect((await ethers.provider.getBalance(sig[6]))).to.equal(bl6 + ethers.parseUnits("0.009375", "ether"));
            });
          });
        });
      });
    });
  });
});

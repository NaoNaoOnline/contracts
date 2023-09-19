import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Policy.search.2", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const pcn = await (await ethers.getContractFactory("Policy")).deploy(5); // _amount == 5

    return { sig, pcn };
  }

  const createRecord = async () => {
    const { sig, pcn } = await loadFixture(deployContract);

    // 0 0 0 got created during deployment
    await pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[1].address, acc: 1 })
    await pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[2].address, acc: 2 })
    await pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[3].address, acc: 3 })

    await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })
    await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })
    await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[2].address, acc: 2 })
    await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[3].address, acc: 3 })

    await pcn.connect(sig[0]).createRecord({ sys: 2, mem: sig[0].address, acc: 0 })
    await pcn.connect(sig[0]).createRecord({ sys: 2, mem: sig[1].address, acc: 1 })
    await pcn.connect(sig[0]).createRecord({ sys: 2, mem: sig[2].address, acc: 2 })
    await pcn.connect(sig[0]).createRecord({ sys: 2, mem: sig[3].address, acc: 3 })

    const blo = await pcn.searchBlocks();

    return { sig, pcn, blo };
  }

  const searchRecordOne = async () => {
    const { sig, pcn, blo } = await loadFixture(createRecord);

    const [cur, rec] = await pcn.searchRecord(0, blo);

    return { sig, pcn, blo, one: cur, rec };
  }

  const createRecordTwo = async () => {
    const { sig, pcn, blo, one, rec } = await loadFixture(searchRecordOne);

    await pcn.connect(sig[0]).createRecord({ sys: 3, mem: sig[0].address, acc: 0 })

    return { sig, pcn, blo, one, rec };
  }

  const searchRecordTwo = async () => {
    const { sig, pcn, blo } = await loadFixture(createRecordTwo);

    const upd = await pcn.searchBlocks();
    const [cur, rec] = await pcn.searchRecord(0, upd);

    return { sig, pcn, blo, two: cur, rec, upd };
  }

  describe("iteration one", () => {
    it("should result in cursor 5", async () => {
      const { one } = await loadFixture(searchRecordOne);
      expect(one).to.equal(5);
    });

    it("should result in five records", async () => {
      const { rec } = await loadFixture(searchRecordOne);
      expect(rec).to.have.length(5);
    });

    describe("record one", () => {
      it("sys: 0, mem: 0, acc: 0", async () => {
        const { sig, rec } = await loadFixture(searchRecordOne);

        expect(rec[0].sys).to.equal(0);
        expect(rec[0].mem).to.equal(sig[0].address);
        expect(rec[0].acc).to.equal(0);
      });
    });

    describe("record two", () => {
      it("sys: 0, mem: 1, acc: 1", async () => {
        const { sig, rec } = await loadFixture(searchRecordOne);

        expect(rec[1].sys).to.equal(0);
        expect(rec[1].mem).to.equal(sig[1].address);
        expect(rec[1].acc).to.equal(1);
      });
    });

    describe("record three", () => {
      it("sys: 0, mem: 2, acc: 2", async () => {
        const { sig, rec } = await loadFixture(searchRecordOne);

        expect(rec[2].sys).to.equal(0);
        expect(rec[2].mem).to.equal(sig[2].address);
        expect(rec[2].acc).to.equal(2);
      });
    });

    describe("record four", () => {
      it("sys: 0, mem: 3, acc: 3", async () => {
        const { sig, rec } = await loadFixture(searchRecordOne);

        expect(rec[3].sys).to.equal(0);
        expect(rec[3].mem).to.equal(sig[3].address);
        expect(rec[3].acc).to.equal(3);
      });
    });

    describe("record five", () => {
      it("sys: 1, mem: 0, acc: 0", async () => {
        const { sig, rec } = await loadFixture(searchRecordOne);

        expect(rec[4].sys).to.equal(1);
        expect(rec[4].mem).to.equal(sig[0].address);
        expect(rec[4].acc).to.equal(0);
      });
    });

    describe("_blocks", () => {
      it("should not change", async () => {
        const { pcn, blo } = await loadFixture(searchRecordOne);
        expect(await pcn.searchBlocks()).to.equal(blo);
      });
    });

    describe("create record", () => {
      describe("_blocks", () => {
        it("should change", async () => {
          const { pcn, blo } = await loadFixture(createRecordTwo);
          expect(await pcn.searchBlocks()).not.to.equal(blo);
        });
      });

      describe("iteration two", () => {
        it("should revert", async () => {
          const { pcn, blo, one } = await loadFixture(createRecordTwo);
          const cal = pcn.searchRecord(one, blo);
          await expect(cal).to.be.revertedWithoutReason();
        });

        describe("start over", () => {
          it("should result in cursor 5", async () => {
            const { two } = await loadFixture(searchRecordTwo);
            expect(two).to.equal(5);
          });

          it("should result in five records", async () => {
            const { rec } = await loadFixture(searchRecordTwo);
            expect(rec).to.have.length(5);
          });

          describe("record one", () => {
            it("sys: 0, mem: 0, acc: 0", async () => {
              const { sig, rec } = await loadFixture(searchRecordTwo);

              expect(rec[0].sys).to.equal(0);
              expect(rec[0].mem).to.equal(sig[0].address);
              expect(rec[0].acc).to.equal(0);
            });
          });

          describe("record two", () => {
            it("sys: 0, mem: 1, acc: 1", async () => {
              const { sig, rec } = await loadFixture(searchRecordTwo);

              expect(rec[1].sys).to.equal(0);
              expect(rec[1].mem).to.equal(sig[1].address);
              expect(rec[1].acc).to.equal(1);
            });
          });

          describe("record three", () => {
            it("sys: 0, mem: 2, acc: 2", async () => {
              const { sig, rec } = await loadFixture(searchRecordTwo);

              expect(rec[2].sys).to.equal(0);
              expect(rec[2].mem).to.equal(sig[2].address);
              expect(rec[2].acc).to.equal(2);
            });
          });

          describe("record four", () => {
            it("sys: 0, mem: 3, acc: 3", async () => {
              const { sig, rec } = await loadFixture(searchRecordTwo);

              expect(rec[3].sys).to.equal(0);
              expect(rec[3].mem).to.equal(sig[3].address);
              expect(rec[3].acc).to.equal(3);
            });
          });

          describe("record five", () => {
            it("sys: 1, mem: 0, acc: 0", async () => {
              const { sig, rec } = await loadFixture(searchRecordTwo);

              expect(rec[4].sys).to.equal(1);
              expect(rec[4].mem).to.equal(sig[0].address);
              expect(rec[4].acc).to.equal(0);
            });
          });

          describe("_blocks", () => {
            it("should not change", async () => {
              const { pcn, upd } = await loadFixture(searchRecordTwo);
              expect(await pcn.searchBlocks()).to.equal(upd);
            });
          });
        });
      });
    });
  });
});

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Policy } from "../typechain-types/Policy";

describe("Policy.create.delete.4", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const pcn = await (await ethers.getContractFactory("Policy")).deploy(0);

    return { sig, pcn };
  }

  describe("sys: 0, mem: 0, acc: 0", () => {
    describe("create", () => {
      describe("sys: 1, mem: 1, acc: 1", () => {
        const createRecord = async () => {
          const { sig, pcn } = await loadFixture(deployContract);

          await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })
          await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })

          return { sig, pcn };
        }

        describe("create", () => {
          describe("sys: 0, mem: 0, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[0].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 0, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[0].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 0, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[0].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 1, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[1].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 1, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[1].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 1, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[1].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 2, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[2].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 2, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[2].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 2, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 0, mem: sig[2].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 0, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 0, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[0].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 0, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[0].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 1, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[1].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 1, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 1, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[1].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 2, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 2, acc: 1", () => {
            const createRecordTwo = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              await pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 1 })

              return { sig, pcn };
            }

            it("should result in four records", async () => {
              const { pcn } = await loadFixture(createRecordTwo);
              expect(await searchRecord(pcn)).to.have.length(4);
            });

            describe("record one", () => {
              it("sys: 0, mem: 0, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                expect((await searchRecord(pcn))[0].sys).to.equal(0);
                expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                expect((await searchRecord(pcn))[0].acc).to.equal(0);
              });
            });

            describe("record two", () => {
              it("sys: 1, mem: 0, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[0].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
              });
            });

            describe("record three", () => {
              it("sys: 1, mem: 1, acc: 1", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                expect((await searchRecord(pcn))[2].sys).to.equal(1);
                expect((await searchRecord(pcn))[2].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[2].acc).to.equal(1);
              });
            });

            describe("record four", () => {
              it("sys: 1, mem: 2, acc: 1", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                expect((await searchRecord(pcn))[3].sys).to.equal(1);
                expect((await searchRecord(pcn))[3].mem).to.equal(sig[2].address);
                expect((await searchRecord(pcn))[3].acc).to.equal(1);
              });
            });

            describe("delete", () => {
              describe("sys: 1, mem: 2, acc: 1", () => {
                const deleteRecordTwo = async () => {
                  const { sig, pcn } = await loadFixture(createRecordTwo);

                  await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 1 })

                  return { sig, pcn };
                }

                it("should result in three records", async () => {
                  const { pcn } = await loadFixture(deleteRecordTwo);
                  expect(await searchRecord(pcn)).to.have.length(3);
                });

                describe("record one", () => {
                  it("sys: 0, mem: 0, acc: 0", async () => {
                    const { sig, pcn } = await loadFixture(deleteRecordTwo);

                    expect((await searchRecord(pcn))[0].sys).to.equal(0);
                    expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                    expect((await searchRecord(pcn))[0].acc).to.equal(0);
                  });
                });

                describe("record two", () => {
                  it("sys: 1, mem: 0, acc: 0", async () => {
                    const { sig, pcn } = await loadFixture(deleteRecordTwo);

                    expect((await searchRecord(pcn))[1].sys).to.equal(1);
                    expect((await searchRecord(pcn))[1].mem).to.equal(sig[0].address);
                    expect((await searchRecord(pcn))[1].acc).to.equal(0);
                  });
                });

                describe("record three", () => {
                  it("sys: 1, mem: 1, acc: 1", async () => {
                    const { sig, pcn } = await loadFixture(deleteRecordTwo);

                    expect((await searchRecord(pcn))[2].sys).to.equal(1);
                    expect((await searchRecord(pcn))[2].mem).to.equal(sig[1].address);
                    expect((await searchRecord(pcn))[2].acc).to.equal(1);
                  });
                });
              });
            });
          });

          describe("sys: 1, mem: 2, acc: 2", () => {
            const createRecordTwo = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              await pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 2 })

              return { sig, pcn };
            }

            it("should result in four records", async () => {
              const { pcn } = await loadFixture(createRecordTwo);
              expect(await searchRecord(pcn)).to.have.length(4);
            });

            describe("record one", () => {
              it("sys: 0, mem: 0, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                expect((await searchRecord(pcn))[0].sys).to.equal(0);
                expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                expect((await searchRecord(pcn))[0].acc).to.equal(0);
              });
            });

            describe("record two", () => {
              it("sys: 1, mem: 0, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[0].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
              });
            });

            describe("record three", () => {
              it("sys: 1, mem: 1, acc: 1", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                expect((await searchRecord(pcn))[2].sys).to.equal(1);
                expect((await searchRecord(pcn))[2].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[2].acc).to.equal(1);
              });
            });

            describe("record four", () => {
              it("sys: 1, mem: 2, acc: 2", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                expect((await searchRecord(pcn))[3].sys).to.equal(1);
                expect((await searchRecord(pcn))[3].mem).to.equal(sig[2].address);
                expect((await searchRecord(pcn))[3].acc).to.equal(2);
              });
            });

            describe("delete", () => {
              describe("sys: 1, mem: 2, acc: 2", () => {
                const deleteRecordTwo = async () => {
                  const { sig, pcn } = await loadFixture(createRecordTwo);

                  await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 2 })

                  return { sig, pcn };
                }

                it("should result in three records", async () => {
                  const { pcn } = await loadFixture(deleteRecordTwo);
                  expect(await searchRecord(pcn)).to.have.length(3);
                });

                describe("record one", () => {
                  it("sys: 0, mem: 0, acc: 0", async () => {
                    const { sig, pcn } = await loadFixture(deleteRecordTwo);

                    expect((await searchRecord(pcn))[0].sys).to.equal(0);
                    expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                    expect((await searchRecord(pcn))[0].acc).to.equal(0);
                  });
                });

                describe("record two", () => {
                  it("sys: 1, mem: 0, acc: 0", async () => {
                    const { sig, pcn } = await loadFixture(deleteRecordTwo);

                    expect((await searchRecord(pcn))[1].sys).to.equal(1);
                    expect((await searchRecord(pcn))[1].mem).to.equal(sig[0].address);
                    expect((await searchRecord(pcn))[1].acc).to.equal(0);
                  });
                });

                describe("record three", () => {
                  it("sys: 1, mem: 1, acc: 1", async () => {
                    const { sig, pcn } = await loadFixture(deleteRecordTwo);

                    expect((await searchRecord(pcn))[2].sys).to.equal(1);
                    expect((await searchRecord(pcn))[2].mem).to.equal(sig[1].address);
                    expect((await searchRecord(pcn))[2].acc).to.equal(1);
                  });
                });
              });
            });
          });

          describe("sys: 2, mem: 0, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[0].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 0, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[0].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 0, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[0].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 1, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[1].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 1, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[1].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 1, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[1].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 2, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[2].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 2, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[2].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 2, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[2].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });
        });

        describe("delete", () => {
          describe("sys: 0, mem: 0, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 0, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 0, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 1, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 1, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 1, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 2, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[2].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 2, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[2].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 0, mem: 2, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[2].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 0, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 0, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 0, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 1, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 1, acc: 1", () => {
            const deleteRecord = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 1 })

              return { sig, pcn };
            }

            it("should result in two records", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await searchRecord(pcn)).to.have.length(2);
            });

            describe("record one", () => {
              it("sys: 0, mem: 0, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);

                expect((await searchRecord(pcn))[0].sys).to.equal(0);
                expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                expect((await searchRecord(pcn))[0].acc).to.equal(0);
              });
            });

            describe("record two", () => {
              it("sys: 1, mem: 0, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[0].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
              });
            });
          });

          describe("sys: 1, mem: 1, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 2, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 2, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 1, mem: 2, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 0, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[0].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 0, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[0].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 0, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[0].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 1, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[1].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 1, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[1].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 1, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[1].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 2, acc: 0", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[2].address, acc: 0 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 2, acc: 1", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[2].address, acc: 1 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });

          describe("sys: 2, mem: 2, acc: 2", () => {
            it("should revert", async () => {
              const { sig, pcn } = await loadFixture(createRecord);
              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 2, mem: sig[2].address, acc: 2 })
              await expect(tnx).to.be.revertedWithoutReason();
            });
          });
        });

        describe("sys: 1, mem: 0, acc: 0", () => {
          describe("delete", () => {
            describe("sys: 1, mem: 0, acc: 0", () => {
              it("should revert", async () => {
                const { sig, pcn } = await loadFixture(createRecord);
                const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })
                await expect(tnx).to.be.revertedWithoutReason();
              });
            });
          });
        });
      });
    });
  });
});

const searchRecord = async (pcn: Policy) => {
  const [_, rec] = await pcn.searchRecord(0, await pcn.searchBlocks());
  return rec;
}

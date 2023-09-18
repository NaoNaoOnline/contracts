import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Policy } from "../typechain-types/Policy";

// TODO test events for all cases
describe("Policy", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const tcn = await (await ethers.getContractFactory("Triple")).deploy();
    // TODO test searchRecord iterations
    const pcn = await (await ethers.getContractFactory("Policy", { libraries: { Triple: await tcn.getAddress() } })).deploy(0);

    return { sig, pcn };
  }

  describe("deployment", () => {
    describe("should emit event", () => {
      describe("SystemCreated", () => {
        it("sys: 0, mem: 0, acc: 0", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          await expect(pcn.deploymentTransaction()).to.emit(pcn, "SystemCreated").withArgs(0, sig[0].address, 0);
        });
      });
    });

    describe("should not emit event", () => {
      it("MemberAdded", async () => {
        const { pcn } = await loadFixture(deployContract);
        await expect(pcn.deploymentTransaction()).not.to.emit(pcn, "MemberAdded");
      });
      it("MemberRemoved", async () => {
        const { pcn } = await loadFixture(deployContract);
        await expect(pcn.deploymentTransaction()).not.to.emit(pcn, "MemberRemoved");
      });
      it("SystemDeleted", async () => {
        const { pcn } = await loadFixture(deployContract);
        await expect(pcn.deploymentTransaction()).not.to.emit(pcn, "SystemDeleted");
      });
    });

    it("should result in one record", async () => {
      const { pcn } = await loadFixture(deployContract);
      expect(await searchRecord(pcn)).to.have.length(1);
    });

    describe("record one", () => {
      it("sys: 0, mem: 0, acc: 0", async () => {
        const { sig, pcn } = await loadFixture(deployContract);

        expect((await searchRecord(pcn))[0].sys).to.equal(0);
        expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
        expect((await searchRecord(pcn))[0].acc).to.equal(0);
      });
    });
  });

  describe("sys: 0, mem: 0, acc: 0", () => {
    describe("create", () => {
      describe("sys: 0, mem: 0, acc: 0", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[0].address, acc: 0 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 0, mem: 0, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[0].address, acc: 1 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 0, mem: 1, acc: 0", () => {
        const createRecord = async () => {
          const { sig, pcn } = await loadFixture(deployContract);

          const tnx = pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[1].address, acc: 0 })
          await tnx;

          return { sig, pcn, tnx };
        }

        describe("should emit event", () => {
          describe("MemberAdded", () => {
            it("sys: 0, mem: 1, acc: 0", async () => {
              const { sig, pcn, tnx } = await loadFixture(createRecord);
              await expect(tnx).to.emit(pcn, "MemberAdded").withArgs(0, sig[1].address, 0);
            });
          });
        });

        describe("should not emit event", () => {
          it("MemberRemoved", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "MemberRemoved");
          });
          it("SystemCreated", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "SystemCreated");
          });
          it("SystemDeleted", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "SystemDeleted");
          });
        });

        it("should result in two records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await searchRecord(pcn)).to.have.length(2);
        });

        describe("record one", () => {
          it("sys: 0, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[0].sys).to.equal(0);
            expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("sys: 0, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[1].sys).to.equal(0);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("delete", () => {
          describe("sys: 0, mem: 1, acc: 0", () => {
            const deleteRecord = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 0 })
              await tnx;

              return { sig, pcn, tnx };
            }

            describe("should emit event", () => {
              describe("MemberRemoved", () => {
                it("sys: 0, mem: 1, acc: 0", async () => {
                  const { sig, pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).to.emit(pcn, "MemberRemoved").withArgs(0, sig[1].address, 0);
                });
              });
            });

            describe("should not emit event", () => {
              it("MemberAdded", async () => {
                const { pcn, tnx } = await loadFixture(deleteRecord);
                await expect(tnx).not.to.emit(pcn, "MemberAdded");
              });
              it("SystemCreated", async () => {
                const { pcn, tnx } = await loadFixture(deleteRecord);
                await expect(tnx).not.to.emit(pcn, "SystemCreated");
              });
              it("SystemDeleted", async () => {
                const { pcn, tnx } = await loadFixture(deleteRecord);
                await expect(tnx).not.to.emit(pcn, "SystemDeleted");
              });
            });

            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await searchRecord(pcn)).to.have.length(1);
            });

            describe("record one", () => {
              it("sys: 0, mem: 0, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);

                expect((await searchRecord(pcn))[0].sys).to.equal(0);
                expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                expect((await searchRecord(pcn))[0].acc).to.equal(0);
              });
            });
          });

          describe("sys: 0, mem: 0, acc: 0", () => {
            const deleteRecord = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              await pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 0 })

              return { sig, pcn };
            }

            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await searchRecord(pcn)).to.have.length(1);
            });

            describe("record one", () => {
              it("sys: 0, mem: 1, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);

                expect((await searchRecord(pcn))[0].sys).to.equal(0);
                expect((await searchRecord(pcn))[0].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[0].acc).to.equal(0);
              });
            });
          });
        });

        describe("sys: 0, mem: 0, acc: 0", () => {
          describe("delete", () => {
            describe("sys: 0, mem: 0, acc: 0", () => {
              const deleteRecord = async () => {
                const { sig, pcn } = await loadFixture(createRecord);

                await pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 0 })

                return { sig, pcn };
              }

              it("should result in one record", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect(await searchRecord(pcn)).to.have.length(1);
              });

              describe("record one", () => {
                it("sys: 0, mem: 1, acc: 0", async () => {
                  const { sig, pcn } = await loadFixture(deleteRecord);

                  expect((await searchRecord(pcn))[0].sys).to.equal(0);
                  expect((await searchRecord(pcn))[0].mem).to.equal(sig[1].address);
                  expect((await searchRecord(pcn))[0].acc).to.equal(0);
                });
              });
            });
          });
        });
      });

      describe("sys: 0, mem: 1, acc: 1", () => {
        const createRecord = async () => {
          const { sig, pcn } = await loadFixture(deployContract);

          await pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[1].address, acc: 1 })

          return { sig, pcn };
        }

        it("should result in two records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await searchRecord(pcn)).to.have.length(2);
        });

        describe("record one", () => {
          it("sys: 0, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[0].sys).to.equal(0);
            expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("sys: 0, mem: 1, acc: 1", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[1].sys).to.equal(0);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(1);
          });
        });

        describe("delete", () => {
          describe("sys: 0, mem: 1, acc: 1", () => {
            const deleteRecord = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              await pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 1 })

              return { sig, pcn };
            }

            describe("sys: 0, mem: 1, acc: 1", () => {
              it("should result in one record", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect(await searchRecord(pcn)).to.have.length(1);
              });

              describe("record one", () => {
                it("sys: 0, mem: 0, acc: 0", async () => {
                  const { sig, pcn } = await loadFixture(deleteRecord);

                  expect((await searchRecord(pcn))[0].sys).to.equal(0);
                  expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                  expect((await searchRecord(pcn))[0].acc).to.equal(0);
                });
              });
            });
          });
        });
      });

      describe("sys: 1, mem: 0, acc: 0", () => {
        const createRecord = async () => {
          const { sig, pcn } = await loadFixture(deployContract);

          await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })

          return { sig, pcn };
        }

        it("should result in two records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await searchRecord(pcn)).to.have.length(2);
        });

        describe("record one", () => {
          it("sys: 0, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[0].sys).to.equal(0);
            expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("sys: 1, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 0, acc: 0", () => {
            const deleteRecord = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })

              return { sig, pcn };
            }

            describe("sys: 1, mem: 0, acc: 0", () => {
              it("should result in one record", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect(await searchRecord(pcn)).to.have.length(1);
              });

              describe("record one", () => {
                it("sys: 0, mem: 0, acc: 0", async () => {
                  const { sig, pcn } = await loadFixture(deleteRecord);

                  expect((await searchRecord(pcn))[0].sys).to.equal(0);
                  expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                  expect((await searchRecord(pcn))[0].acc).to.equal(0);
                });
              });
            });
          });
        });
      });

      describe("sys: 1, mem: 0, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 1 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 1, mem: 1, acc: 0", () => {
        const createRecord = async () => {
          const { sig, pcn } = await loadFixture(deployContract);

          await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 0 })

          return { sig, pcn };
        }

        it("should result in two records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await searchRecord(pcn)).to.have.length(2);
        });

        describe("record one", () => {
          it("sys: 0, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[0].sys).to.equal(0);
            expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("sys: 1, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 1, acc: 0", () => {
            const deleteRecord = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })

              return { sig, pcn };
            }

            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await searchRecord(pcn)).to.have.length(1);
            });

            describe("record one", () => {
              it("sys: 0, mem: 0, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);

                expect((await searchRecord(pcn))[0].sys).to.equal(0);
                expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
                expect((await searchRecord(pcn))[0].acc).to.equal(0);
              });
            });
          });
        });
      });

      describe("sys: 1, mem: 1, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: [1, 1], mem: [1, 2], acc: [1, 1]", () => {
        const createRecord = async () => {
          const { sig, pcn } = await loadFixture(deployContract);

          await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })
          await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })
          await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[2].address, acc: 1 })

          return { sig, pcn };
        }

        it("should result in four records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await searchRecord(pcn)).to.have.length(4);
        });

        describe("record one", () => {
          it("sys: 0, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[0].sys).to.equal(0);
            expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("sys: 1, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("sys: 1, mem: 1, acc: 1", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[2].sys).to.equal(1);
            expect((await searchRecord(pcn))[2].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[2].acc).to.equal(1);
          });
        });

        describe("record four", () => {
          it("sys: 1, mem: 2, acc: 1", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[3].sys).to.equal(1);
            expect((await searchRecord(pcn))[3].mem).to.equal(sig[2].address);
            expect((await searchRecord(pcn))[3].acc).to.equal(1);
          });
        });

        describe("delete", () => {
          describe("sys: [1, 1], mem: [1, 2], acc: [1, 1]", () => {
            const deleteRecord = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 1 })
              await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 1 })

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
        });
      });
    });

    describe("delete", () => {
      describe("sys: 0, mem: 0, acc: 0", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 0 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 0, mem: 0, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 1 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 0, mem: 1, acc: 0", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 0 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 0, mem: 1, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 1 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 1, mem: 0, acc: 0", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 1, mem: 0, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 1 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 1, mem: 1, acc: 0", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 1, mem: 1, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 1 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });
    });
  });

  describe("sys: 0, mem: 1, acc: 1", () => {
    const createRecord = async () => {
      const { sig, pcn } = await loadFixture(deployContract);

      await pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[1].address, acc: 1 })

      return { sig, pcn };
    }

    describe("create", () => {
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

      describe("sys: 1, mem: 2, acc: 0", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(createRecord);
          const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 0 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 1, mem: 2, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(createRecord);
          const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 1 })
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

      describe("sys: 0, mem: 1, acc: 0", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(createRecord);
          const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 0 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 0, mem: 1, acc: 1", () => {
        const deleteRecord = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 1 })

          return { sig, pcn };
        }

        it("should result in one record", async () => {
          const { pcn } = await loadFixture(deleteRecord);
          expect(await searchRecord(pcn)).to.have.length(1);
        });

        describe("record one", () => {
          it("sys: 0, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(deleteRecord);

            expect((await searchRecord(pcn))[0].sys).to.equal(0);
            expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[0].acc).to.equal(0);
          });
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

      describe("sys: 1, mem: 1, acc: 0", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(createRecord);
          const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })
          await expect(tnx).to.be.revertedWithoutReason();
        });
      });

      describe("sys: 1, mem: 1, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(createRecord);
          const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 1 })
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
    });
  });

  describe("sys: 1, mem: 1, acc: 0", () => {
    const createRecord = async () => {
      const { sig, pcn } = await loadFixture(deployContract);

      await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 0 })

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
        const createRecordTwo = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })

          return { sig, pcn };
        }

        it("should result in three records", async () => {
          const { pcn } = await loadFixture(createRecordTwo);
          expect(await searchRecord(pcn)).to.have.length(3);
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
          it("sys: 1, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("sys: 1, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[2].sys).to.equal(1);
            expect((await searchRecord(pcn))[2].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[2].acc).to.equal(0);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 0, acc: 0", () => {
            const deleteRecordTwo = async () => {
              const { sig, pcn } = await loadFixture(createRecordTwo);

              await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })

              return { sig, pcn };
            }

            it("should result in two records", async () => {
              const { pcn } = await loadFixture(deleteRecordTwo);
              expect(await searchRecord(pcn)).to.have.length(2);
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
              it("sys: 1, mem: 1, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecordTwo);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
              });
            });
          });
        });
      });

      describe("sys: 1, mem: 0, acc: 1", () => {
        const createRecordTwo = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[0].address, acc: 1 })

          return { sig, pcn };
        }

        it("should result in three records", async () => {
          const { pcn } = await loadFixture(createRecordTwo);
          expect(await searchRecord(pcn)).to.have.length(3);
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
          it("sys: 1, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("sys: 1, mem: 0, acc: 1", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[2].sys).to.equal(1);
            expect((await searchRecord(pcn))[2].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[2].acc).to.equal(1);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 0, acc: 1", () => {
            const deleteRecordTwo = async () => {
              const { sig, pcn } = await loadFixture(createRecordTwo);

              await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 1 })

              return { sig, pcn };
            }

            it("should result in two records", async () => {
              const { pcn } = await loadFixture(deleteRecordTwo);
              expect(await searchRecord(pcn)).to.have.length(2);
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
              it("sys: 1, mem: 1, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecordTwo);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
              });
            });
          });
        });
      });

      describe("sys: 1, mem: 0, acc: 2", () => {
        const createRecordTwo = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[0].address, acc: 2 })

          return { sig, pcn };
        }

        it("should result in three records", async () => {
          const { pcn } = await loadFixture(createRecordTwo);
          expect(await searchRecord(pcn)).to.have.length(3);
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
          it("sys: 1, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("sys: 1, mem: 0, acc: 2", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[2].sys).to.equal(1);
            expect((await searchRecord(pcn))[2].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[2].acc).to.equal(2);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 0, acc: 2", () => {
            const deleteRecordTwo = async () => {
              const { sig, pcn } = await loadFixture(createRecordTwo);

              await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 2 })

              return { sig, pcn };
            }

            it("should result in two records", async () => {
              const { pcn } = await loadFixture(deleteRecordTwo);
              expect(await searchRecord(pcn)).to.have.length(2);
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
              it("sys: 1, mem: 1, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecordTwo);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
              });
            });
          });
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
        const createRecordTwo = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 0 })

          return { sig, pcn };
        }

        it("should result in three records", async () => {
          const { pcn } = await loadFixture(createRecordTwo);
          expect(await searchRecord(pcn)).to.have.length(3);
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
          it("sys: 1, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("sys: 1, mem: 2, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[2].sys).to.equal(1);
            expect((await searchRecord(pcn))[2].mem).to.equal(sig[2].address);
            expect((await searchRecord(pcn))[2].acc).to.equal(0);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 2, acc: 0", () => {
            const deleteRecordTwo = async () => {
              const { sig, pcn } = await loadFixture(createRecordTwo);

              await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 0 })

              return { sig, pcn };
            }

            it("should result in two records", async () => {
              const { pcn } = await loadFixture(deleteRecordTwo);
              expect(await searchRecord(pcn)).to.have.length(2);
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
              it("sys: 1, mem: 1, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecordTwo);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
              });
            });
          });
        });
      });

      describe("sys: 1, mem: 2, acc: 1", () => {
        const createRecordTwo = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 1 })

          return { sig, pcn };
        }

        it("should result in three records", async () => {
          const { pcn } = await loadFixture(createRecordTwo);
          expect(await searchRecord(pcn)).to.have.length(3);
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
          it("sys: 1, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("sys: 1, mem: 2, acc: 1", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[2].sys).to.equal(1);
            expect((await searchRecord(pcn))[2].mem).to.equal(sig[2].address);
            expect((await searchRecord(pcn))[2].acc).to.equal(1);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 2, acc: 1", () => {
            const deleteRecordTwo = async () => {
              const { sig, pcn } = await loadFixture(createRecordTwo);

              await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 1 })

              return { sig, pcn };
            }

            it("should result in two records", async () => {
              const { pcn } = await loadFixture(deleteRecordTwo);
              expect(await searchRecord(pcn)).to.have.length(2);
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
              it("sys: 1, mem: 1, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecordTwo);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
              });
            });
          });
        });

        describe("sys: 1, mem: 1, acc: 0", () => {
          describe("delete", () => {
            describe("sys: 1, mem: 1, acc: 0", () => {
              it("should revert", async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);
                const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })
                await expect(tnx).to.be.revertedWithoutReason();
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

        it("should result in three records", async () => {
          const { pcn } = await loadFixture(createRecordTwo);
          expect(await searchRecord(pcn)).to.have.length(3);
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
          it("sys: 1, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("sys: 1, mem: 2, acc: 2", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);

            expect((await searchRecord(pcn))[2].sys).to.equal(1);
            expect((await searchRecord(pcn))[2].mem).to.equal(sig[2].address);
            expect((await searchRecord(pcn))[2].acc).to.equal(2);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 2, acc: 2", () => {
            const deleteRecordTwo = async () => {
              const { sig, pcn } = await loadFixture(createRecordTwo);

              await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 2 })

              return { sig, pcn };
            }

            it("should result in two records", async () => {
              const { pcn } = await loadFixture(deleteRecordTwo);
              expect(await searchRecord(pcn)).to.have.length(2);
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
              it("sys: 1, mem: 1, acc: 0", async () => {
                const { sig, pcn } = await loadFixture(deleteRecordTwo);

                expect((await searchRecord(pcn))[1].sys).to.equal(1);
                expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
                expect((await searchRecord(pcn))[1].acc).to.equal(0);
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
        const deleteRecord = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })

          return { sig, pcn };
        }

        it("should result in one record", async () => {
          const { pcn } = await loadFixture(deleteRecord);
          expect(await searchRecord(pcn)).to.have.length(1);
        });

        describe("record one", () => {
          it("sys: 0, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(deleteRecord);

            expect((await searchRecord(pcn))[0].sys).to.equal(0);
            expect((await searchRecord(pcn))[0].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[0].acc).to.equal(0);
          });
        });
      });

      describe("sys: 1, mem: 1, acc: 1", () => {
        it("should revert", async () => {
          const { sig, pcn } = await loadFixture(createRecord);
          const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 1 })
          await expect(tnx).to.be.revertedWithoutReason();
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

    describe("sys: 0, mem: 0, acc: 0", () => {
      describe("create", () => {
        describe("sys: 1, mem: 0, acc: 0", () => {
          const createRecordTwo = async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })

            return { sig, pcn };
          }

          it("should result in three records", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect(await searchRecord(pcn)).to.have.length(3);
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
            it("sys: 1, mem: 1, acc: 0", async () => {
              const { sig, pcn } = await loadFixture(createRecordTwo);

              expect((await searchRecord(pcn))[1].sys).to.equal(1);
              expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
              expect((await searchRecord(pcn))[1].acc).to.equal(0);
            });
          });

          describe("record three", () => {
            it("sys: 1, mem: 0, acc: 0", async () => {
              const { sig, pcn } = await loadFixture(createRecordTwo);

              expect((await searchRecord(pcn))[2].sys).to.equal(1);
              expect((await searchRecord(pcn))[2].mem).to.equal(sig[0].address);
              expect((await searchRecord(pcn))[2].acc).to.equal(0);
            });
          });

          describe("delete", () => {
            describe("sys: 1, mem: 0, acc: 0", () => {
              const deleteRecordTwo = async () => {
                const { sig, pcn } = await loadFixture(createRecordTwo);

                await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })

                return { sig, pcn };
              }

              it("should result in two records", async () => {
                const { pcn } = await loadFixture(deleteRecordTwo);
                expect(await searchRecord(pcn)).to.have.length(2);
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
                it("sys: 1, mem: 1, acc: 0", async () => {
                  const { sig, pcn } = await loadFixture(deleteRecordTwo);

                  expect((await searchRecord(pcn))[1].sys).to.equal(1);
                  expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
                  expect((await searchRecord(pcn))[1].acc).to.equal(0);
                });
              });
            });
          });

          describe("sys: 1, mem: 1, acc: 0", () => {
            describe("delete", () => {
              describe("sys: 1, mem: 0, acc: 0", () => {
                const deleteRecordTwo = async () => {
                  const { sig, pcn } = await loadFixture(createRecordTwo);

                  await pcn.connect(sig[1]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })

                  return { sig, pcn };
                }

                it("should result in two records", async () => {
                  const { pcn } = await loadFixture(deleteRecordTwo);
                  expect(await searchRecord(pcn)).to.have.length(2);
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
                  it("sys: 1, mem: 1, acc: 0", async () => {
                    const { sig, pcn } = await loadFixture(deleteRecordTwo);

                    expect((await searchRecord(pcn))[1].sys).to.equal(1);
                    expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
                    expect((await searchRecord(pcn))[1].acc).to.equal(0);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

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

const searchRecord = async (pcn: Policy) => {
  const [_, rec] = await pcn.searchRecord(0, await pcn.searchBlocks());
  return rec;
}

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Policy } from "../typechain-types/Policy";

describe("Policy.create.delete.1", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const pcn = await (await ethers.getContractFactory("Policy")).deploy(0);

    return { sig, pcn };
  }

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
          describe("CreateMember", () => {
            it("sys: 0, mem: 1, acc: 0", async () => {
              const { sig, pcn, tnx } = await loadFixture(createRecord);
              await expect(tnx).to.emit(pcn, "CreateMember").withArgs(0, sig[1].address, 0);
            });
          });
        });

        describe("should not emit event", () => {
          it("CreateSystem", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "CreateSystem");
          });

          it("DeleteMember", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "DeleteMember");
          });

          it("DeleteSystem", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "DeleteSystem");
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
          describe("sys: 0, mem: 0, acc: 0", () => {
            const deleteRecord = async () => {
              const { sig, pcn } = await loadFixture(createRecord);

              const tnx = pcn.connect(sig[1]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 0 })
              await tnx;

              return { sig, pcn, tnx };
            }

            describe("should emit event", () => {
              describe("DeleteMember", () => {
                it("sys: 0, mem: 0, acc: 0", async () => {
                  const { sig, pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).to.emit(pcn, "DeleteMember").withArgs(0, sig[0].address, 0);
                });
              });
            });

            describe("should not emit event", () => {
              it("CreateMember", async () => {
                const { pcn, tnx } = await loadFixture(deleteRecord);
                await expect(tnx).not.to.emit(pcn, "CreateMember");
              });

              it("CreateSystem", async () => {
                const { pcn, tnx } = await loadFixture(deleteRecord);
                await expect(tnx).not.to.emit(pcn, "CreateSystem");
              });

              it("DeleteSystem", async () => {
                const { pcn, tnx } = await loadFixture(deleteRecord);
                await expect(tnx).not.to.emit(pcn, "DeleteSystem");
              });
            });

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

                const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[0].address, acc: 0 })
                await tnx;

                return { sig, pcn, tnx };
              }

              describe("should emit event", () => {
                describe("DeleteMember", () => {
                  it("sys: 0, mem: 0, acc: 0", async () => {
                    const { sig, pcn, tnx } = await loadFixture(deleteRecord);
                    await expect(tnx).to.emit(pcn, "DeleteMember").withArgs(0, sig[0].address, 0);
                  });
                });
              });

              describe("should not emit event", () => {
                it("CreateMember", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateMember");
                });

                it("CreateSystem", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateSystem");
                });

                it("DeleteSystem", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "DeleteSystem");
                });
              });

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

            describe("sys: 0, mem: 1, acc: 0", () => {
              const deleteRecord = async () => {
                const { sig, pcn } = await loadFixture(createRecord);

                const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 0 })
                await tnx;

                return { sig, pcn, tnx };
              }

              describe("should emit event", () => {
                describe("DeleteMember", () => {
                  it("sys: 0, mem: 1, acc: 0", async () => {
                    const { sig, pcn, tnx } = await loadFixture(deleteRecord);
                    await expect(tnx).to.emit(pcn, "DeleteMember").withArgs(0, sig[1].address, 0);
                  });
                });
              });

              describe("should not emit event", () => {
                it("CreateMember", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateMember");
                });

                it("CreateSystem", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateSystem");
                });

                it("DeleteSystem", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "DeleteSystem");
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
          });
        });
      });

      describe("sys: 0, mem: 1, acc: 1", () => {
        const createRecord = async () => {
          const { sig, pcn } = await loadFixture(deployContract);

          const tnx = pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[1].address, acc: 1 })
          await tnx;

          return { sig, pcn, tnx };
        }

        describe("should emit event", () => {
          describe("CreateMember", () => {
            it("sys: 0, mem: 1, acc: 1", async () => {
              const { sig, pcn, tnx } = await loadFixture(createRecord);
              await expect(tnx).to.emit(pcn, "CreateMember").withArgs(0, sig[1].address, 1);
            });
          });
        });

        describe("should not emit event", () => {
          it("CreateSystem", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "CreateSystem");
          });

          it("DeleteMember", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "DeleteMember");
          });

          it("DeleteSystem", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "DeleteSystem");
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
          it("sys: 0, mem: 1, acc: 1", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[1].sys).to.equal(0);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(1);
          });
        });

        describe("sys: 0, mem: 0, acc: 0", () => {
          describe("delete", () => {
            describe("sys: 0, mem: 1, acc: 1", () => {
              const deleteRecord = async () => {
                const { sig, pcn } = await loadFixture(createRecord);

                const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 1 })
                await tnx;

                return { sig, pcn, tnx };
              }

              describe("should emit event", () => {
                describe("DeleteMember", () => {
                  it("sys: 0, mem: 1, acc: 1", async () => {
                    const { sig, pcn, tnx } = await loadFixture(deleteRecord);
                    await expect(tnx).to.emit(pcn, "DeleteMember").withArgs(0, sig[1].address, 1);
                  });
                });
              });

              describe("should not emit event", () => {
                it("CreateMember", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateMember");
                });

                it("CreateSystem", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateSystem");
                });

                it("DeleteSystem", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "DeleteSystem");
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
          });
        });
      });

      describe("sys: 1, mem: 0, acc: 0", () => {
        const createRecord = async () => {
          const { sig, pcn } = await loadFixture(deployContract);

          const tnx = pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })
          await tnx;

          return { sig, pcn, tnx };
        }

        describe("should emit event", () => {
          describe("CreateSystem", () => {
            it("sys: 1, mem: 0, acc: 0", async () => {
              const { sig, pcn, tnx } = await loadFixture(createRecord);
              await expect(tnx).to.emit(pcn, "CreateSystem").withArgs(1, sig[0].address, 0);
            });
          });
        });

        describe("should not emit event", () => {
          it("CreateMember", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "CreateMember");
          });

          it("DeleteMember", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "DeleteMember");
          });

          it("DeleteSystem", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "DeleteSystem");
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
          it("sys: 1, mem: 0, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[0].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("sys: 0, mem: 0, acc: 0", () => {
          describe("delete", () => {
            describe("sys: 1, mem: 0, acc: 0", () => {
              const deleteRecord = async () => {
                const { sig, pcn } = await loadFixture(createRecord);

                const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })
                await tnx;

                return { sig, pcn, tnx };
              }

              describe("should emit event", () => {
                describe("DeleteSystem", () => {
                  it("sys: 1, mem: 0, acc: 0", async () => {
                    const { sig, pcn, tnx } = await loadFixture(deleteRecord);
                    await expect(tnx).to.emit(pcn, "DeleteSystem").withArgs(1, sig[0].address, 0);
                  });
                });
              });

              describe("should not emit event", () => {
                it("CreateMember", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateMember");
                });

                it("CreateSystem", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateSystem");
                });

                it("DeleteMember", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "DeleteMember");
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

          const tnx = pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 0 })
          await tnx;

          return { sig, pcn, tnx };
        }

        describe("should emit event", () => {
          describe("CreateSystem", () => {
            it("sys: 1, mem: 1, acc: 0", async () => {
              const { sig, pcn, tnx } = await loadFixture(createRecord);
              await expect(tnx).to.emit(pcn, "CreateSystem").withArgs(1, sig[1].address, 0);
            });
          });
        });

        describe("should not emit event", () => {
          it("CreateMember", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "CreateMember");
          });

          it("DeleteMember", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "DeleteMember");
          });

          it("DeleteSystem", async () => {
            const { pcn, tnx } = await loadFixture(createRecord);
            await expect(tnx).not.to.emit(pcn, "DeleteSystem");
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
          it("sys: 1, mem: 1, acc: 0", async () => {
            const { sig, pcn } = await loadFixture(createRecord);

            expect((await searchRecord(pcn))[1].sys).to.equal(1);
            expect((await searchRecord(pcn))[1].mem).to.equal(sig[1].address);
            expect((await searchRecord(pcn))[1].acc).to.equal(0);
          });
        });

        describe("sys: 0, mem: 0, acc: 0", () => {
          describe("delete", () => {
            describe("sys: 1, mem: 1, acc: 0", () => {
              const deleteRecord = async () => {
                const { sig, pcn } = await loadFixture(createRecord);

                const tnx = pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })
                await tnx;

                return { sig, pcn, tnx };
              }

              describe("should emit event", () => {
                describe("DeleteSystem", () => {
                  it("sys: 1, mem: 1, acc: 0", async () => {
                    const { sig, pcn, tnx } = await loadFixture(deleteRecord);
                    await expect(tnx).to.emit(pcn, "DeleteSystem").withArgs(1, sig[1].address, 0);
                  });
                });
              });

              describe("should not emit event", () => {
                it("CreateMember", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateMember");
                });

                it("CreateSystem", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "CreateSystem");
                });

                it("DeleteMember", async () => {
                  const { pcn, tnx } = await loadFixture(deleteRecord);
                  await expect(tnx).not.to.emit(pcn, "DeleteMember");
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
});

const searchRecord = async (pcn: Policy) => {
  const [_, rec] = await pcn.searchRecord(0, await pcn.searchBlocks());
  return rec;
}

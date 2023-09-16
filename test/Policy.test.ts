import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// TODO test that when you are access zero and there are another members without access zero that you cannot remove yourself
// TODO test that access zero can be replaced in system zero by another access zero
// TODO test that any member can always remove themselves
// TODO test that when you are access zero and there is another access zero that you can remove yourself
// TODO add the delete cases for all createRecordTwo
describe("Policy", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const pcn = await (await ethers.getContractFactory("Policy")).deploy();

    return { sig, pcn };
  }

  describe("deployment", () => {
    it("should result in one record", async () => {
      const { pcn } = await loadFixture(deployContract);
      expect(await pcn.searchRecord()).to.have.length(1);
    });

    describe("record one", () => {
      it("should have system zero", async () => {
        const { pcn } = await loadFixture(deployContract);
        expect((await pcn.searchRecord())[0].sys).to.equal(0);
      });

      it("should have member address for signer one", async () => {
        const { sig, pcn } = await loadFixture(deployContract);
        expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
      });

      it("should have access zero", async () => {
        const { pcn } = await loadFixture(deployContract);
        expect((await pcn.searchRecord())[0].acc).to.equal(0);
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

          await pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[1].address, acc: 0 })

          return { sig, pcn };
        }

        const deleteRecord = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 0 })

          return { sig, pcn };
        }

        it("should result in two records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await pcn.searchRecord()).to.have.length(2);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].sys).to.equal(0);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("delete", () => {
          describe("sys: 0, mem: 1, acc: 1", () => {
            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await pcn.searchRecord()).to.have.length(1);
            });

            describe("recod one", () => {
              it("should have system zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].sys).to.equal(0);
              });

              it("should have member address for signer one", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
              });

              it("should have access zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].acc).to.equal(0);
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

        const deleteRecord = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 1 })

          return { sig, pcn };
        }

        it("should result in two records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await pcn.searchRecord()).to.have.length(2);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].sys).to.equal(0);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access one", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].acc).to.equal(1);
          });
        });

        describe("delete", () => {
          describe("sys: 0, mem: 1, acc: 1", () => {
            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await pcn.searchRecord()).to.have.length(1);
            });

            describe("recod one", () => {
              it("should have system zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].sys).to.equal(0);
              });

              it("should have member address for signer one", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
              });

              it("should have access zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].acc).to.equal(0);
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

        const deleteRecord = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })

          return { sig, pcn };
        }

        it("should result in two records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await pcn.searchRecord()).to.have.length(2);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 0, acc: 0", () => {
            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await pcn.searchRecord()).to.have.length(1);
            });

            describe("recod one", () => {
              it("should have system zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].sys).to.equal(0);
              });

              it("should have member address for signer one", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
              });

              it("should have access zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].acc).to.equal(0);
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

        const deleteRecord = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })

          return { sig, pcn };
        }

        it("should result in two records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await pcn.searchRecord()).to.have.length(2);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("delete", () => {
          describe("sys: 1, mem: 1, acc: 0", () => {
            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await pcn.searchRecord()).to.have.length(1);
            });

            describe("recod one", () => {
              it("should have system zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].sys).to.equal(0);
              });

              it("should have member address for signer one", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
              });

              it("should have access zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].acc).to.equal(0);
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

        const deleteRecord = async () => {
          const { sig, pcn } = await loadFixture(createRecord);

          await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 1 })
          await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[2].address, acc: 1 })

          return { sig, pcn };
        }

        it("should result in four records", async () => {
          const { pcn } = await loadFixture(createRecord);
          expect(await pcn.searchRecord()).to.have.length(4);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[1].address);
          });

          it("should have access one", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[2].acc).to.equal(1);
          });
        });

        describe("record four", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[3].sys).to.equal(1);
          });

          it("should have member address for signer three", async () => {
            const { sig, pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[3].mem).to.equal(sig[2].address);
          });

          it("should have access one", async () => {
            const { pcn } = await loadFixture(createRecord);
            expect((await pcn.searchRecord())[3].acc).to.equal(1);
          });
        });

        describe("delete", () => {
          describe("sys: [1, 1], mem: [1, 2], acc: [1, 1]", () => {
            it("should result in two records", async () => {
              const { pcn } = await loadFixture(deleteRecord);
              expect(await pcn.searchRecord()).to.have.length(2);
            });

            describe("recod one", () => {
              it("should have system zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].sys).to.equal(0);
              });

              it("should have member address for signer one", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
              });

              it("should have access zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[0].acc).to.equal(0);
              });
            });

            describe("recod two", () => {
              it("should have system one", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[1].sys).to.equal(1);
              });

              it("should have member address for signer one", async () => {
                const { sig, pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[1].mem).to.equal(sig[0].address);
              });

              it("should have access zero", async () => {
                const { pcn } = await loadFixture(deleteRecord);
                expect((await pcn.searchRecord())[1].acc).to.equal(0);
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
          expect(await pcn.searchRecord()).to.have.length(1);
        });

        describe("recod one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(deleteRecord);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(deleteRecord);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(deleteRecord);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
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

    // TODO add equivalent deletes
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
          expect(await pcn.searchRecord()).to.have.length(3);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].acc).to.equal(0);
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
          expect(await pcn.searchRecord()).to.have.length(3);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[0].address);
          });

          it("should have access one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].acc).to.equal(1);
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
          expect(await pcn.searchRecord()).to.have.length(3);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[0].address);
          });

          it("should have access two", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].acc).to.equal(2);
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
          expect(await pcn.searchRecord()).to.have.length(3);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer three", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[2].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].acc).to.equal(0);
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
          expect(await pcn.searchRecord()).to.have.length(3);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer three", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[2].address);
          });

          it("should have access one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].acc).to.equal(1);
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
          expect(await pcn.searchRecord()).to.have.length(3);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer three", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[2].address);
          });

          it("should have access two", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].acc).to.equal(2);
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
  });

  describe("sys: 1, mem: 1, acc: 1", () => {
    const createRecord = async () => {
      const { sig, pcn } = await loadFixture(deployContract);

      await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })
      await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })

      return { sig, pcn };
    }

    // TODO add equivalent deletes
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
          expect(await pcn.searchRecord()).to.have.length(4);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[1].address);
          });

          it("should have access one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].acc).to.equal(1);
          });
        });

        describe("record four", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[3].sys).to.equal(1);
          });

          it("should have member address for signer three", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[3].mem).to.equal(sig[2].address);
          });

          it("should have access one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[3].acc).to.equal(1);
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
          expect(await pcn.searchRecord()).to.have.length(4);
        });

        describe("record one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });

        describe("record two", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].sys).to.equal(1);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[1].acc).to.equal(0);
          });
        });

        describe("record three", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].sys).to.equal(1);
          });

          it("should have member address for signer two", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].mem).to.equal(sig[1].address);
          });

          it("should have access one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[2].acc).to.equal(1);
          });
        });

        describe("record four", () => {
          it("should have system one", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[3].sys).to.equal(1);
          });

          it("should have member address for signer three", async () => {
            const { sig, pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[3].mem).to.equal(sig[2].address);
          });

          it("should have access two", async () => {
            const { pcn } = await loadFixture(createRecordTwo);
            expect((await pcn.searchRecord())[3].acc).to.equal(2);
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
  });
});

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// TODO test that you cannot add yourself twice to the same system
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

  describe("member of system zero with access zero", () => {
    describe("creating a new system", () => {
      describe("for themselves", () => {
        describe("with access zero", () => {
          const createSystem = async () => {
            const { sig, pcn } = await loadFixture(deployContract);

            await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })

            return { sig, pcn };
          }

          const deleteSystem = async () => {
            const { sig, pcn } = await loadFixture(createSystem);

            await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[0].address, acc: 0 })

            return { sig, pcn };
          }

          it("should result in two records", async () => {
            const { pcn } = await loadFixture(createSystem);
            expect(await pcn.searchRecord()).to.have.length(2);
          });

          describe("record one", () => {
            it("should have system zero", async () => {
              const { pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[0].sys).to.equal(0);
            });

            it("should have member address for signer one", async () => {
              const { sig, pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
            });

            it("should have access zero", async () => {
              const { pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[0].acc).to.equal(0);
            });
          });

          describe("record two", () => {
            it("should have system one", async () => {
              const { pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[1].sys).to.equal(1);
            });

            it("should have member address for signer one", async () => {
              const { sig, pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[1].mem).to.equal(sig[0].address);
            });

            it("should have access zero", async () => {
              const { pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[1].acc).to.equal(0);
            });
          });

          describe("deleting the created system", () => {
            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteSystem);
              expect(await pcn.searchRecord()).to.have.length(1);
            });

            describe("recod one", () => {
              it("should have system zero", async () => {
                const { pcn } = await loadFixture(deleteSystem);
                expect((await pcn.searchRecord())[0].sys).to.equal(0);
              });

              it("should have member address for signer one", async () => {
                const { sig, pcn } = await loadFixture(deleteSystem);
                expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
              });

              it("should have access zero", async () => {
                const { pcn } = await loadFixture(deleteSystem);
                expect((await pcn.searchRecord())[0].acc).to.equal(0);
              });
            });
          });
        });

        describe("with access one", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(deployContract);
            const tnx = pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 1 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });
      });

      describe("for somebody else", () => {
        describe("with access zero", () => {
          const createSystem = async () => {
            const { sig, pcn } = await loadFixture(deployContract);

            await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 0 })

            return { sig, pcn };
          }

          const deleteSystem = async () => {
            const { sig, pcn } = await loadFixture(createSystem);

            await pcn.connect(sig[0]).deleteRecord({ sys: 1, mem: sig[1].address, acc: 0 })

            return { sig, pcn };
          }

          it("should result in two records", async () => {
            const { pcn } = await loadFixture(createSystem);
            expect(await pcn.searchRecord()).to.have.length(2);
          });

          describe("record one", () => {
            it("should have system zero", async () => {
              const { pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[0].sys).to.equal(0);
            });

            it("should have member address for signer one", async () => {
              const { sig, pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
            });

            it("should have access zero", async () => {
              const { pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[0].acc).to.equal(0);
            });
          });

          describe("record two", () => {
            it("should have system one", async () => {
              const { pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[1].sys).to.equal(1);
            });

            it("should have member address for signer two", async () => {
              const { sig, pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
            });

            it("should have access zero", async () => {
              const { pcn } = await loadFixture(createSystem);
              expect((await pcn.searchRecord())[1].acc).to.equal(0);
            });
          });

          describe("deleting the created system", () => {
            it("should result in one record", async () => {
              const { pcn } = await loadFixture(deleteSystem);
              expect(await pcn.searchRecord()).to.have.length(1);
            });

            describe("recod one", () => {
              it("should have system zero", async () => {
                const { pcn } = await loadFixture(deleteSystem);
                expect((await pcn.searchRecord())[0].sys).to.equal(0);
              });

              it("should have member address for signer one", async () => {
                const { sig, pcn } = await loadFixture(deleteSystem);
                expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
              });

              it("should have access zero", async () => {
                const { pcn } = await loadFixture(deleteSystem);
                expect((await pcn.searchRecord())[0].acc).to.equal(0);
              });
            });
          });
        });

        describe("with access one", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(deployContract);
            const tnx = pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });
      });
    });

    describe("adding a new member to system zero", () => {
      const addMember = async () => {
        const { sig, pcn } = await loadFixture(deployContract);

        await pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[1].address, acc: 1 })

        return { sig, pcn };
      }

      const removeMember = async () => {
        const { sig, pcn } = await loadFixture(addMember);

        await pcn.connect(sig[0]).deleteRecord({ sys: 0, mem: sig[1].address, acc: 1 })

        return { sig, pcn };
      }

      it("should result in two records", async () => {
        const { pcn } = await loadFixture(addMember);
        expect(await pcn.searchRecord()).to.have.length(2);
      });

      describe("record one", () => {
        it("should have system zero", async () => {
          const { pcn } = await loadFixture(addMember);
          expect((await pcn.searchRecord())[0].sys).to.equal(0);
        });

        it("should have member address for signer one", async () => {
          const { sig, pcn } = await loadFixture(addMember);
          expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
        });

        it("should have access zero", async () => {
          const { pcn } = await loadFixture(addMember);
          expect((await pcn.searchRecord())[0].acc).to.equal(0);
        });
      });

      describe("record two", () => {
        it("should have system zero", async () => {
          const { pcn } = await loadFixture(addMember);
          expect((await pcn.searchRecord())[1].sys).to.equal(0);
        });

        it("should have member address for signer two", async () => {
          const { sig, pcn } = await loadFixture(addMember);
          expect((await pcn.searchRecord())[1].mem).to.equal(sig[1].address);
        });

        it("should have access one", async () => {
          const { pcn } = await loadFixture(addMember);
          expect((await pcn.searchRecord())[1].acc).to.equal(1);
        });
      });

      describe("removing the added member from system zero", () => {
        it("should result in one record", async () => {
          const { pcn } = await loadFixture(removeMember);
          expect(await pcn.searchRecord()).to.have.length(1);
        });

        describe("recod one", () => {
          it("should have system zero", async () => {
            const { pcn } = await loadFixture(removeMember);
            expect((await pcn.searchRecord())[0].sys).to.equal(0);
          });

          it("should have member address for signer one", async () => {
            const { sig, pcn } = await loadFixture(removeMember);
            expect((await pcn.searchRecord())[0].mem).to.equal(sig[0].address);
          });

          it("should have access zero", async () => {
            const { pcn } = await loadFixture(removeMember);
            expect((await pcn.searchRecord())[0].acc).to.equal(0);
          });
        });
      });
    });
  });

  describe("member of system zero with access one", () => {
    const addMember = async () => {
      const { sig, pcn } = await loadFixture(deployContract);

      await pcn.connect(sig[0]).createRecord({ sys: 0, mem: sig[1].address, acc: 1 })

      return { sig, pcn };
    }

    describe("creating a new system", () => {
      describe("for themselves", () => {
        describe("with access zero", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[1].address, acc: 0 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });

        describe("with access one", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });
      });

      describe("for somebody else", () => {
        describe("with access zero", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 0 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });

        describe("with access one", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 1, mem: sig[2].address, acc: 1 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });
      });
    });
  });

  describe("member of system one with access zero", () => {
    const addMember = async () => {
      const { sig, pcn } = await loadFixture(deployContract);

      await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 0 })

      return { sig, pcn };
    }

    describe("creating a new system", () => {
      describe("for themselves", () => {
        describe("with access zero", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[1].address, acc: 0 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });

        describe("with access one", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[1].address, acc: 1 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });
      });

      describe("for somebody else", () => {
        describe("with access zero", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[2].address, acc: 0 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });

        describe("with access one", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[2].address, acc: 1 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });
      });
    });
  });

  describe("member of system one with access one", () => {
    const addMember = async () => {
      const { sig, pcn } = await loadFixture(deployContract);

      await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[0].address, acc: 0 })
      await pcn.connect(sig[0]).createRecord({ sys: 1, mem: sig[1].address, acc: 1 })

      return { sig, pcn };
    }

    describe("creating a new system", () => {
      describe("for themselves", () => {
        describe("with access zero", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[1].address, acc: 0 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });

        describe("with access one", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[1].address, acc: 1 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });
      });

      describe("for somebody else", () => {
        describe("with access zero", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[2].address, acc: 0 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });

        describe("with access one", () => {
          it("should revert", async () => {
            const { sig, pcn } = await loadFixture(addMember);
            const tnx = pcn.connect(sig[1]).createRecord({ sys: 2, mem: sig[2].address, acc: 1 })
            await expect(tnx).to.be.revertedWithoutReason();
          });
        });
      });
    });
  });
});

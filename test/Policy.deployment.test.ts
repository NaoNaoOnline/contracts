import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Policy } from "../typechain-types/Policy";

describe("Policy.deployment", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const pcn = await (await ethers.getContractFactory("Policy")).deploy(0);

    return { sig, pcn };
  }

  describe("deployment", () => {
    describe("should emit event", () => {
      describe("CreateSystem", () => {
        it("sys: 0, mem: 0, acc: 0", async () => {
          const { sig, pcn } = await loadFixture(deployContract);
          await expect(pcn.deploymentTransaction()).to.emit(pcn, "CreateSystem").withArgs(0, sig[0].address, 0);
        });
      });
    });

    describe("should not emit event", () => {
      it("CreateMember", async () => {
        const { pcn } = await loadFixture(deployContract);
        await expect(pcn.deploymentTransaction()).not.to.emit(pcn, "CreateMember");
      });

      it("DeleteMember", async () => {
        const { pcn } = await loadFixture(deployContract);
        await expect(pcn.deploymentTransaction()).not.to.emit(pcn, "DeleteMember");
      });

      it("DeleteSystem", async () => {
        const { pcn } = await loadFixture(deployContract);
        await expect(pcn.deploymentTransaction()).not.to.emit(pcn, "DeleteSystem");
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

    describe("_amount", () => {
      it("should deafult to 100", async () => {
        const { pcn } = await loadFixture(deployContract);
        expect((await pcn.searchAmount())).to.equal(100);
      });
    });

    describe("_blocks", () => {
      it("should be set to block height of deployment transaction", async () => {
        const { pcn } = await loadFixture(deployContract);
        expect((await pcn.searchBlocks())).to.equal(pcn.deploymentTransaction()?.blockNumber);
      });
    });
  });
});

const searchRecord = async (pcn: Policy) => {
  const [_, rec] = await pcn.searchRecord(0, await pcn.searchBlocks());
  return rec;
}

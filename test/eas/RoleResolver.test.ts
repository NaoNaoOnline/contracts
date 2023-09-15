import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("RoleResolver", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("SchemaRegistry")).deploy();
    const ecn = await (await ethers.getContractFactory("EAS")).deploy(await scn.getAddress());
    const rcn = await (await ethers.getContractFactory("RoleResolver")).deploy(await ecn.getAddress());

    return { sig, scn, ecn, rcn };
  }

  describe("deployment", () => {
    it("should define admin role", async () => {
      const { rcn } = await loadFixture(deployContract);
      expect(await rcn.ROLE_ADMIN()).to.equal(ethers.toBigInt(1));
    });

    it("should define moderator role", async () => {
      const { rcn } = await loadFixture(deployContract);
      expect(await rcn.ROLE_MDRTR()).to.equal(ethers.toBigInt(0));
    });

    describe("listAdmins", () => {
      it("should contain deployer", async () => {
        const { sig, rcn } = await loadFixture(deployContract);
        expect(await rcn.listAdmins()).to.have.length(1);
        expect(await rcn.listAdmins()).to.contain(sig[0].address);
      });
    });

    describe("listMdrtr", () => {
      it("should be empty", async () => {
        const { rcn } = await loadFixture(deployContract);
        expect(await rcn.listMdrtr()).to.have.length(0);
      });
    });
  });

  describe("grantMdrtr", () => {
    const grantMdrtr = async () => {
      const { sig, scn, ecn, rcn } = await loadFixture(deployContract);

      await rcn.grantMdrtr(sig[0].address);

      return { sig, scn, ecn, rcn };
    }

    describe("listAdmins", () => {
      it("should contain deployer", async () => {
        const { sig, rcn } = await loadFixture(grantMdrtr);
        expect(await rcn.listAdmins()).to.have.length(1);
        expect(await rcn.listAdmins()).to.contain(sig[0].address);
      });
    });

    describe("listMdrtr", () => {
      it("should contain deployer", async () => {
        const { sig, rcn } = await loadFixture(grantMdrtr);
        expect(await rcn.listMdrtr()).to.have.length(1);
        expect(await rcn.listMdrtr()).to.contain(sig[0].address);
      });
    });
  });
});

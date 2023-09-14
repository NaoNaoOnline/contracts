import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SchemaRegistry", function () {
  async function deployRegistry() {
    const sig = await ethers.getSigners();

    const fac = await ethers.getContractFactory("SchemaRegistry");
    const con = await fac.deploy();
    const add = await con.getAddress();

    const reg = new SchemaRegistry(add);
    reg.connect(sig[0]);

    return { reg };
  }

  async function registerSchema() {
    const { reg } = await loadFixture(deployRegistry);

    const tnx = await reg.register({
      schema: "bytes32 schemaId,string name", // NAME A SCHEME
      revocable: true,
    });

    const uid = await tnx.wait();

    return { reg, uid };
  }

  describe("deployment", function () {
    it("should yield registry version", async function () {
      const { reg } = await loadFixture(deployRegistry);

      expect(await reg.getVersion()).to.equal("1.2.0");
    });
  });

  describe("registry", function () {
    it("should register schema", async function () {
      const { uid } = await loadFixture(registerSchema);

      expect(uid).to.equal("0x44d562ac1d7cd77e232978687fea027ace48f719cf1d58c7888e509663bb87fc");
    });

    it("should get schema", async function () {
      const { reg, uid } = await loadFixture(registerSchema);

      const rec = await reg.getSchema({ uid: uid });

      expect(rec.resolver).to.equal("0x0000000000000000000000000000000000000000");
      expect(rec.revocable).to.equal(true);
      expect(rec.uid).to.equal(uid);
      expect(rec.schema).to.equal("bytes32 schemaId,string name");
    });
  });
});

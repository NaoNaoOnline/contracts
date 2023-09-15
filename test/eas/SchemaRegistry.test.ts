import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const schema: string = "bytes32 schemaId,string name"; // NAME A SCHEME

describe("SchemaRegistry", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("SchemaRegistry")).deploy();
    const rcl = new SchemaRegistry(await scn.getAddress()).connect(sig[0]);

    return { sig, scn, rcl };
  }

  const registerSchema = async () => {
    const { sig, scn, rcl } = await loadFixture(deployContract);

    const tnx = await rcl.register({
      schema: schema,
      revocable: true,
    });

    const sid = await tnx.wait();

    return { sig, scn, rcl, sid };
  }

  describe("deployment", () => {
    it("should yield registry version", async () => {
      const { rcl } = await loadFixture(deployContract);

      expect(await rcl.getVersion()).to.equal("1.2.0");
    });
  });

  describe("registry", () => {
    it("should register schema", async () => {
      const { sid } = await loadFixture(registerSchema);

      expect(sid).to.equal("0x44d562ac1d7cd77e232978687fea027ace48f719cf1d58c7888e509663bb87fc");
    });

    it("should get schema", async () => {
      const { rcl, sid } = await loadFixture(registerSchema);

      const rec = await rcl.getSchema({ uid: sid });

      expect(rec.resolver).to.equal("0x0000000000000000000000000000000000000000");
      expect(rec.revocable).to.equal(true);
      expect(rec.uid).to.equal(sid);
      expect(rec.schema).to.equal("bytes32 schemaId,string name");
    });
  });
});

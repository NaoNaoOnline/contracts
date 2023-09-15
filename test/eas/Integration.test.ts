import { EAS, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const schema: string = "string user";

describe("Integration", () => {
  const deployContract = async () => {
    const sig = await ethers.getSigners();

    const scn = await (await ethers.getContractFactory("SchemaRegistry")).deploy();
    const ecn = await (await ethers.getContractFactory("EAS")).deploy(await scn.getAddress());
    const rcn = await (await ethers.getContractFactory("RoleResolver")).deploy(await ecn.getAddress());

    const rcl = new SchemaRegistry(await scn.getAddress()).connect(sig[0]);
    const ecl = new EAS(await ecn.getAddress()).connect(sig[0]);

    return { sig, scn, ecn, rcn, rcl, ecl };
  }

  const registerSchema = async () => {
    const { sig, scn, ecn, rcn, rcl, ecl } = await loadFixture(deployContract);

    const tnx = await rcl.register({
      schema: schema,
      resolverAddress: await rcn.getAddress(),
      revocable: true,
    });

    const sid = await tnx.wait();

    return { sig, scn, ecn, rcn, rcl, ecl, sid };
  }

  describe("attestation", () => {
    describe("with grantMdrtr", () => {
      it("should be able to attest", async () => {
        const { sig, rcn, ecl, sid } = await loadFixture(registerSchema);

        await rcn.grantMdrtr(sig[0].address);

        const tnx = await ecl.attest({
          schema: sid,
          data: {
            recipient: sig[0].address, // the eth address we grant the role
            revocable: true,
            data: encode("1694726399"), // the user id we grant the role
          },
        });

        const aid = await tnx.wait();

        expect(ethers.isHexString(aid)).to.equal(true);
      });
    });

    describe("without grantMdrtr", () => {
      it("should not be able to attest", async () => {
        const { sig, ecn, ecl, sid } = await loadFixture(registerSchema);

        const tnx = ecl.attest({
          schema: sid,
          data: {
            recipient: sig[0].address, // the eth address we grant the role
            revocable: true,
            data: encode("1694726399"), // the user id we grant the role
          },
        })

        await expect(tnx).to.be.revertedWithCustomError(ecn, "InvalidAttestation");
      });
    });
  });
});

const encode = (str: string): string => {
  const schemaEncoder = new SchemaEncoder(schema);
  return schemaEncoder.encodeData([
    { name: "user", value: str, type: "string" },
  ]);
}

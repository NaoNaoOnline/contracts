import { HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

import "hardhat-gas-reporter";

const SEPOLIA_PRIVATE_KEY = "[REDACTED]";

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: "[REDACTED]"
  },
  gasReporter: {
    enabled: true,
    noColors: true,
  },
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/[REDACTED]",
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};

export default config;

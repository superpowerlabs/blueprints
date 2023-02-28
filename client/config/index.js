/* eslint-disable */
const contracts = Object.assign(
  require("./deployed.json"),
  require("./deployedProduction.json")
);

const contractWhitelist = ["SynCityCoupons", "SeedPool"];

for (let chainId in contracts) {
  let item = contracts[chainId];
  let tmp = {};
  for (let name in item) {
    if (!!~contractWhitelist.indexOf(name)) {
      tmp[name] = item[name];
    }
  }
  contracts[chainId] = tmp;
}

function toHex(val) {
  return "0x" + Number(val).toString(16);
}

let isTestnet;
if (typeof window !== "undefined") {
  isTestnet = /(local|jeroyafra)/.test(window.location.origin);
} else if (!!process) {
  isTestnet = true;
}

const supportedId = {};
supportedId[56] = "BSC";

if (isTestnet) {
  supportedId[97] = "BSC Testnet";
  supportedId[1337] = "localhost";
  supportedId[44787] = "Alfajores";
}

const config = {
  supportedId,
  chainConf: {
    56: {
      chainId: "0x" + Number(56).toString(16),
      chainName: "BSC",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      blockExplorerUrls: ["https://bscscan.com"],
    },
    44787: isTestnet
      ? {
          chainId: "0x" + Number(44787).toString(16),
          chainName: "Alfajores",
          nativeCurrency: {
            name: "CELO",
            symbol: "CELO",
            decimals: 18,
          },
          rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
          blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org"],
        }
      : undefined,
  },
  contracts,
  abi: require("./ABIs.json").contracts,
  preferredOrder: [
    "Rarity",
    "Tier",
    "Health",
    "Attack",
    "Defense",
    "Heal",
    "Soul",
    "Gender",
    "Personality",
    "Trait",
    "Gang",
    "Combat Style",
    "Chest",
    "Hair",
    "Head",
    "Legs",
    "Badge",
    "Macro Ability",
    "Cybernetic Implant",
    "Class",
    "Weapon Type",
  ],
  updated: require("./updated.json"),
};

module.exports = config;

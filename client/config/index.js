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

let isDev;

if (typeof window !== "undefined") {
  const { hostname } = window.location;
  isDev = /localhost/.test(hostname);
}

const supportedId = {};
if (isDev) {
  supportedId[56] = "BSC";
  supportedId[97] = "BSC Testnet";
  supportedId[1337] = "localhost";
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

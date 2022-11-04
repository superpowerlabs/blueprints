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
let isTestnet;
let isStage;
let isProd;
let isJero;

if (typeof window !== "undefined") {
  const { hostname } = window.location;
  isDev = /localhost/.test(hostname);
  isStage = /(staking-stage|jeroyafra).mob.land(|\.local)$/.test(hostname);
  isTestnet = isDev || isStage;
  isProd = /staking.mob.land/.test(hostname);
  isJero = /jeroyafra/.test(hostname);
} else if (!!process) {
  isDev = isTestnet = true;
}

const config = {
  supportedId: {
    56: {
      chainId: toHex(56),
      chainName: "BNB Chain",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      blockExplorerUrls: ["https://bscscan.com"],
    },
    97: isDev
      ? {
          chainId: toHex(97),
          chainName: "BNB Chain Testnet",
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
          blockExplorerUrls: ["https://testnet.bscscan.com"],
        }
      : undefined,
    1337: isDev
      ? {
          chainId: toHex(1337),
          chainName: "Localhost 8545",
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["http://localhost:8545"],
          blockExplorerUrls: [],
        }
      : undefined,
    43113:
      isStage || isDev
        ? {
            chainId: toHex(43113),
            chainName: "Fuji",
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
            blockExplorerUrls: ["https://cchain.explorer.avax-test.network"],
            isTestnet: true,
          }
        : undefined,
  },
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
    // "Skin Tone",
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
};

module.exports = config;

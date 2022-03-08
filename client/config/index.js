/* eslint-disable */
const contracts = Object.assign(
  require("./deployed.json"),
  require("./deployedProduction.json")
);

const contractWhitelist = ["SynCityCoupon"];

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

const supportedId = {};
supportedId[56] = "BSC";
supportedId[97] = "BSC Testnet";

const config = {
  supportedId,
  contracts,
  abi: require("./ABIs.json").contracts,
  preferredOrder: [
    "Rarity",
    "Tier",
    "Gender",
    "Personality",
    "Trait",
    "Gang",
    "Skin Tone",
    "Combat Style",
    "Macro Ability",
    "Chest",
    "Hair",
    "Head",
    "Legs",
    "Badge",
    "Cybernetic Implant",
    "Health",
    "Attack",
    "Defense",
    "Heal",
    "Soul",
    "Class",
    "Weapon Type",
    "Active Ability 1",
    "Active Ability 2",
    "Passive Ability",
    "Leader Ability",
  ],
};

module.exports = config;

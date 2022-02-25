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
};

module.exports = config;

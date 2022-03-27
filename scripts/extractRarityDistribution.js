#!/usr/bin/env node

const fspath = require("fspath");
const {preferredOrder} = require("../client/config");

const metadata = require("../input/allMetadata.json");

let traits = {
  Rarity: {
    Common: 0,
    Uncommon: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0
  }
};

for (let m of metadata) {
  for (let a of m.attributes) {
    if (!traits[a.trait_type]) {
      traits[a.trait_type] = {};
    }
    if (!traits[a.trait_type][a.value]) {
      traits[a.trait_type][a.value] = 1;
    } else {
      traits[a.trait_type][a.value]++;
    }
  }
}

let dist = {};
for (let key of preferredOrder) {
  dist[key] = traits[key];
}

let output = new fspath("./public/json/rarityDistribution.json");
output.write(JSON.stringify(dist, null, 2));


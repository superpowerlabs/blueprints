#!/usr/bin/env node

const fspath = require("fspath");
const { preferredOrder } = require("../client/config");
// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("../public/json/allMetadata.json");

let traits = {};
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

// index data

let index = {};
for (let m of metadata) {
  for (let a of m.attributes) {
    let key = [a.trait_type, a.value].join("|");
    if (!index[key]) {
      index[key] = [];
    }
    index[key].push(m.tokenId);
  }
}

output = new fspath("./public/json/indexedMetadata.json");
output.write(JSON.stringify(index, null, 2));

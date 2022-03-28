#!/usr/bin/env node

const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("../input/allMetadata.json");
const rarityDistribution = require("../public/json/rarityDistribution.json");
let rarityIndex = {};
let min = 50000;
let max = 0;

for (let i = 0; i < metadata.length; i++) {
  let a = metadata[i].attributes;
  let score = 0;
  for (let t of a) {
    score += rarityDistribution[t.trait_type][t.value];
  }
  min = Math.min(min, score);
  max = Math.max(max, score);
}

for (let i = 0; i < metadata.length; i++) {
  let a = metadata[i].attributes;
  let score = 0;
  for (let t of a) {
    score += rarityDistribution[t.trait_type][t.value];
  }
  score = max - score + 100;
  rarityIndex[metadata[i].tokenId] = score;
}

let output = new fspath("./public/json/rarityIndex.json");
output.write(JSON.stringify(rarityIndex));

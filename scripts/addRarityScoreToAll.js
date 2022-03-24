#!/usr/bin/env node

const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("../public/json/allMetadata.json");
const rarityScore = require("../public/json/rarityScore.json");

let traits = [];
for (let m of metadata) {
  for (let score of rarityScore) {
    if (score[0] === m.tokenId) {
      m.rarity_score = score[1];
      traits.push(m);
    }
  }
}

let output = new fspath("./public/json/allDataandRarityScore.json");
output.write(JSON.stringify(traits, null, 2));

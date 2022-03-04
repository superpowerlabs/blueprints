#!/usr/bin/env node

const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const allDataandRarityScore = require("./client/config/allDataandRarityScore.json");

const sorted = allDataandRarityScore.sort(function (a, b) {
  return b.rarity_score - a.rarity_score;
});

let output = new fspath("./client/config/sortedAllDataandRarityScore.json");
output.write(JSON.stringify(sorted, null, 2));
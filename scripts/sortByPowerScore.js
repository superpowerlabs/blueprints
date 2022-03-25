#!/usr/bin/env node
const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const allDataandRarityScore = require("../tmp/allValueMetadata.json");

allDataandRarityScore.sort(function (a, b) {
  a = a.rarity_score;
  b = b.rarity_score;
  return a < b ? 1 : a > b ? -1 : 0;
});

let output = new fspath("./tmp/sortedValueScore.json");
output.write(JSON.stringify(allDataandRarityScore, null, 2));

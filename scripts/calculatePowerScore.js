#!/usr/bin/env node

const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("../input/allMetadata.json");
const stats = ["Health", "Attack", "Defense", "Heal", "Soul"];

function addDecimals(s = "", c = 2) {
  s = s.toString().split(".");
  s[1] = (s[1] || "").substring(0, c);
  s[1] = s[1] + "0".repeat(c - s[1].length);
  return s.join(".");
}

for (let m of metadata) {
  let score = 0;
  let tier;
  for (let a of m.attributes) {
    if (stats.includes(a.trait_type)) {
      score += (1 / (1 + 10 ** -(parseInt(a.value) / 10 - 4))) * 500;
    }
    if (a.trait_type === "Tier") {
      tier = parseInt(a.value);
    }
  }
  score *= tier;
  m.rarity_score = parseFloat(addDecimals(score));
}

let output = new fspath("./tmp/allValueMetadata.json");
output.write(JSON.stringify(metadata, null, 2));

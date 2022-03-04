#!/usr/bin/env node
const fspath = require("fspath");

// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("./client/config/allMetadata.json");
let total = 0;
let traits = {};

for (let m of metadata) {
  total++;
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


const addSomeDecimals = (s, c = 2) => {
  s = s.toString().split(".");
  s[1] = (s[1] || "").substring(0, c);
  s[1] = s[1] + "0".repeat(c - s[1].length);
  return s.join(".");
};

let preferredOrder = [
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
];

let dist = {};

for (let key of preferredOrder) {
  dist[key] = traits[key];
}

for ( let attributes in dist) {
  const keys = Object.keys(dist[attributes]);
  keys.forEach((key, index) => {
    dist[attributes][key] = addSomeDecimals(
      (dist[attributes][key] / total) * 100
    );
  });
}

let output = new fspath("./client/config/percentageDistribution.json");
output.write(JSON.stringify(dist, null, 2));

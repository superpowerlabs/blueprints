#!/usr/bin/env node

const fspath = require("fspath");

// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("./client/config/allMetadata.json");

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

let output = new fspath("./client/config/rarityDistribution.json");
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

output = new fspath("./client/config/indexedMetadata.json");
output.write(JSON.stringify(index, null, 2));

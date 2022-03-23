#!/usr/bin/env node

const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("../client/config/allMetadata.json");
const percentageDistribution = require("../client/config/percentageDistribution.json");
const stats = ["Health", "Attack", "Defense", "Heal", "Soul"];
// const abilities = [
//   "Active Ability 1",
//   "Active Ability 2",
//   "Passive Ability",
//   "Leader Ability",
// ];

let traits = [];
for (let m of metadata) {
  const temp = [m.tokenId, m.attributes];
  traits.push(temp);
}

let per = [];

// i = each user
for (let i = 0; i < traits.length; i++) {
  //j attribute per user

  let totalStats = 0;
  let totalAttributes = 0;
  let totalRarity = 0;
  let totalAbilities = 0;
  let totalTier = 0;
  for (let j = 0; j < traits[i][1].length; j++) {
    for (let p in percentageDistribution) {
      if (p === traits[i][1][j].trait_type) {
        const key = Object.keys(percentageDistribution[p]);
        key.forEach((val, index) => {
          if (val === traits[i][1][j].value) {
            if (stats.includes(traits[i][1][j].trait_type)) {
              totalStats =
                totalStats + 1 / (percentageDistribution[p][val] / 100);
              totalStats = totalStats * 0.1;
            } else if (traits[i][1][j].trait_type === "Rarity") {
              totalRarity =
                totalRarity + 1 / (percentageDistribution[p][val] / 100);
              totalRarity = totalRarity * 10;
            } else if (traits[i][1][j].trait_type === "Tier") {
              totalTier =
                totalTier + 1 / (percentageDistribution[p][val] / 100);
              totalTier = totalTier * 2;
              // } else if (abilities.includes(traits[i][1][j].trait_type)) {
              //   totalAbilities =
              //     totalAbilities + 1 / (percentageDistribution[p][val] / 100);
              //   totalAbilities = totalAbilities * 1.1;
            } else {
              totalAttributes =
                totalAttributes + 1 / (percentageDistribution[p][val] / 100);
              totalAttributes = totalAttributes * 1;
            }
          }
        });
      }
    }
  }
  totalScore = totalAttributes + totalStats + totalRarity + totalAbilities;
  console.log(totalScore);
  per.push([traits[i][0], totalScore]);
}

let output = new fspath("./client/config/rarityScore.json");
output.write(JSON.stringify(per, null, 2));

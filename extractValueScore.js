#!/usr/bin/env node

const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("./public/json/allMetadata.json");
const percentageDistribution = require("./public/json/percentageDistribution.json");
const stats = ["Health", "Attack", "Defense", "Heal", "Soul"];

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
  let totalTier = 0;
  for (let j = 0; j < traits[i][1].length; j++) {
    for (let p in percentageDistribution) {
      if (p === traits[i][1][j].trait_type) {
        const key = Object.keys(percentageDistribution[p]);
        key.forEach((val, index) => {
          if (val === traits[i][1][j].value) {
            if (stats.includes(traits[i][1][j].trait_type)) {
              totalStats = (1 / (1 + 10 ** -(val / 10 - 4))) * 500;
            } else if (traits[i][1][j].trait_type === "Tier") {
              totalTier =
                totalTier + 1 / (percentageDistribution[p][val] / 100);
            }
          }
        });
      }
    }
  }
  totalScore = totalStats * totalTier;
  console.log(totalScore);
  per.push([traits[i][0], totalScore]);
}

let output = new fspath("./public/json/valueScore.json");
output.write(JSON.stringify(per, null, 2));

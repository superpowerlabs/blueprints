#!/usr/bin/env node

const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const metadata = require("../public/json/allMetadata.json");
const percentageDistribution = require("../public/json/percentageDistribution.json");
const stats = ["Health", "Attack", "Defense", "Heal", "Soul"];

function addDecimals (s = "", c = 2) {
  s = s.toString().split(".");
  s[1] = (s[1] || "").substring(0, c);
  s[1] = s[1] + "0".repeat(c - s[1].length);
  return s.join(".");
}

for (let m of metadata) {
  let score = 0
  let tier
  for (let a of m.attributes) {
    if (stats.includes(a.trait_type)) {
      score += (1 / (1 + 10 ** -(parseInt(a.value) / 10 - 4))) * 500;
    }
    if (a.trait_type === 'Tier') {
      tier = parseInt(a.value)
    }
  }
  score *= tier
  m.rarity_score = parseFloat(addDecimals(score))
}

let output = new fspath("./public/json/allValueMetadata.json");
output.write(JSON.stringify(metadata, null, 2));

//
// let traits = [];
// for (let m of metadata) {
//   const temp = [m.tokenId, m.attributes];
//   traits.push(temp);
// }
//
// let per = [];
//
// // i = each user
// for (let i = 0; i < traits.length; i++) {
//   //j attribute per user
//
//   // ( 1 / (1 + 10 * e^-((x/10) - 4) )) * 500
//
//   let totalStats = 0;
//   let totalTier = 0;
//   for (let j = 0; j < traits[i][1].length; j++) {
//     for (let p in percentageDistribution) {
//       if (p === traits[i][1][j].trait_type) {
//         const key = Object.keys(percentageDistribution[p]);
//         key.forEach((val, index) => {
//           if (val === traits[i][1][j].value) {
//             if (stats.includes(traits[i][1][j].trait_type)) {
//               totalStats = (1 / (1 + 10 ** -(val / 10 - 4))) * 500;
//             } else if (traits[i][1][j].trait_type === "Tier") {
//               totalTier =
//                 totalTier + 1 / (percentageDistribution[p][val] / 100);
//             }
//           }
//         });
//       }
//     }
//   }
//   let totalScore = totalStats * totalTier;
//   per.push([traits[i][0], totalScore]);
// }
//
// let output = new fspath("./public/json/valueScore.json");
// output.write(JSON.stringify(per, null, 2));

#!/usr/bin/env node
const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const metas = require("../public/json/allMetadata.json");

let csv = metas[0].attributes
  .map((e) => e.trait_type)
  .concat("mp4", "png")
  .join(",");

let values = [];
for (let m of metas) {
  for (let a of m.attributes) {
    if (values.indexOf(a.value) === -1) {
      values.push(a.value);
    }
  }
}

let indexedValuesArray = new fspath("./public/json/indexedValuesArray.json");
indexedValuesArray.write(JSON.stringify(values));

for (let m of metas) {
  csv +=
    "\n" +
    m.attributes
      .map((e) => values.indexOf(e.value))
      .concat([
        m.extras.mp4_sha256.substring(0, 16),
        m.extras.png_sha256.substring(0, 16),
      ])
      .join(",");
}

let output = new fspath("./public/json/metadata.csv.js");
output.write(`module.exports = \`${csv}\``);

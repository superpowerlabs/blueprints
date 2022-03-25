#!/usr/bin/env node

const fspath = require("fspath");
const metadata = require("../input/allMetadata.json");

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

let output = new fspath("./public/json/indexedMetadata.json");
output.write(JSON.stringify(index, null, 2));

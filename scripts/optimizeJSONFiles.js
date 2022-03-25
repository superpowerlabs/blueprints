#!/usr/bin/env node
const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

const dictionary = [];

let metadata = require("../tmp/allValueMetadata.json");

for (let m of metadata) {
  delete m.description;
  delete m.name;
  delete m.image;
  m.i = m.tokenId;
  delete m.tokenId;
  m.a = m.animation_url.split("/")[5].split(".")[0];
  delete m.animation_url;
  m.j = m.extras.thumbnail.split("/")[5].split("-")[0];
  delete m.extras;
  delete m.extend_info;
  for (let i = 0; i < m.attributes.length; i++) {
    let t = m.attributes[i].trait_type;
    let v = m.attributes[i].value;
    if (dictionary.indexOf(t) === -1) {
      dictionary.push(t);
    }
    if (dictionary.indexOf(v) === -1) {
      dictionary.push(v);
    }
    m.attributes[i] = {
      t: dictionary.indexOf(t),
      v: dictionary.indexOf(v),
    };
  }
  m.A = m.attributes;
  delete m.attributes;
}

let output = new fspath("./public/json/allMetadataOptimized.json");
output.write(JSON.stringify(metadata));

let sortedMetadata = require("../tmp/sortedValueScore.json");
let finalSorted = [];
for (let m of sortedMetadata) {
  finalSorted.push(m.tokenId);
}
output = new fspath("./public/json/sortedValueScoreOptimized.json");
output.write(JSON.stringify(finalSorted));

output = new fspath("./public/json/dictionary.json");
output.write(JSON.stringify(dictionary));

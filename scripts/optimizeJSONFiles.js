#!/usr/bin/env node
const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

function optimize(metadata) {
  for (let m of metadata) {
    delete m.description;
    delete m.name;
    delete m.image;
    m.animation_url = m.animation_url.split("/")[5].split(".")[0];
    m.thumbnail = m.extras.thumbnail.split("/")[5].split("-")[0];
    delete m.extras;
    delete m.extend_info;
    for (let i = 0; i < m.attributes.length; i++) {
      m.attributes[i] = {
        t: m.attributes[i].trait_type,
        v: m.attributes[i].value,
      };
    }
  }
  return metadata;
}

let metas = require("../public/json/allValueMetadata.json");
let output = new fspath("./public/json/allValueMetadataOptimized.json");
output.write(JSON.stringify(optimize(metas)));

metas = require("../public/json/sortedValueScore.json");
output = new fspath("./public/json/sortedValueScoreOptimized.json");
output.write(JSON.stringify(optimize(metas)));

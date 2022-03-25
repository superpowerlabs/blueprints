#!/usr/bin/env node
const fspath = require("fspath");
// we do not want to re-execute this by mistake
// process.exit(0)

let metas = require("../public/json/allValueMetadata.json");

for (let m of metas) {
  delete m.description
  delete m.extras.mp4_sha256
  delete m.extras.idx
  delete m.extras.png_sha256
  delete m.extend_info
}

let output = new fspath("./public/json/allValueMetadataOptimized.json");
output.write(JSON.stringify(metas));

metas = require("../public/json/sortedValueScore.json");

for (let m of metas) {
  delete m.description
  delete m.extras.mp4_sha256
  delete m.extras.idx
  delete m.extras.png_sha256
  delete m.extend_info
}

output = new fspath("./public/json/sortedValueScoreOptimized.json");
output.write(JSON.stringify(metas));


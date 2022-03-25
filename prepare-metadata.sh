#!/usr/bin/env bash

if [[ ! -d "tmp" ]]; then
    mkdir tmp
fi

scripts/extractPercentageDistribution.js
scripts/indexMetadata.js
scripts/calculatePowerScore.js
scripts/sortByPowerScore.js
scripts/optimizeJSONFiles.js

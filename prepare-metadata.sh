#!/usr/bin/env bash

if [[ ! -d "tmp" ]]; then
    mkdir tmp
fi

echo "Extract percentage distribution"
scripts/extractPercentageDistribution.js

echo "Extract rarity distribution"
scripts/extractRarityDistribution.js

echo "Index metadata"
scripts/indexMetadata.js

echo "Calculate Power score"
scripts/calculatePowerScore.js

echo "Sort metadata by power score"
scripts/sortByPowerScore.js

echo "Optimize indexes"
scripts/optimizeJSONFiles.js

echo "Add statistical rarity score"
scripts/extraRarityIndex.js

#!/usr/bin/env bash

node scripts/extractPercentageDistribution.js
node scripts/extractRarityDistribution.js
node scripts/calculatePowerScore.js
node scripts/addValueScore.js
node scripts/sortByPowerScore.js

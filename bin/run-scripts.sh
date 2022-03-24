#!/usr/bin/env bash

node scripts/extractPercentageDistribution.js 
node scripts/extractRarityDistribution.js 
node scripts/extractValueScore.js
node scripts/addValueScore.js
node scripts/sortByValueScore.js